function qwebirc_ui_onbeforeunload(e) { /* IE sucks */
  var message = "This action will close all active IRC connections.";
  var e = e || window.event;
  if(e)
    e.returnValue = message;
  return message;
}

qwebirc.ui.Interface = new Class({
  Implements: [Options],
  options: {
    initialNickname: "Guest" + Math.ceil(Math.random() * 100000),
    initialChannels: "#bountysource",
    networkName: "ExampleNetwork",
    networkServices: [],
    loginRegex: null,
    appTitle: "ExampleNetwork Web IRC",
    searchURL: true,
    theme: undefined,
    baseURL: null,
    hue: null,
    saturation: null,
    lightness: null,
    thue: null,
    tsaturation: null,
    tlightness: null,
    uiOptionsArg: null,
    nickValidation: null,
    dynamicBaseURL: "/",
    staticBaseURL: "/"
  },
  initialize: function(element, ui, options) {
    this.setOptions(options);
    
    /* HACK */
    qwebirc.global = {
      dynamicBaseURL: options.dynamicBaseURL,
      staticBaseURL: options.staticBaseURL,
      nicknameValidator: $defined(options.nickValidation) ? new qwebirc.irc.NicknameValidator(options.nickValidation) : new qwebirc.irc.DummyNicknameValidator()
    };

    window.addEvent("domready", function() {
      var callback = function(options) {
        var IRC = new qwebirc.irc.IRCClient(options, ui_);
        IRC.connect();
        //window.onbeforeunload = qwebirc_ui_onbeforeunload;
        window.addEvent("unload", function() {
          IRC.quit("Page closed");
        });
      };


      var args = qwebirc.util.parseURI(String(document.location));
      var inick = args["nick"];
      var ichans = this.options.initialChannels;

      if(!inick)
        inick = this.options.initialNickname;

      var ui_ = new ui($(element), new qwebirc.ui.Theme(this.options.theme), this.options);
      var details = ui_.loginBox(callback, inick, ichans, false, false);
    }.bind(this));
  },
  getHueArg: function(args, t) {
    var hue = args[t + "hue"];
    if(!$defined(hue))
      return null;
    hue = parseInt(hue);
    if(hue > 360 || hue < 0)
      return null;
    return hue;
  },
  getSaturationArg: function(args, t) {
    var saturation = args[t + "saturation"];
    if(!$defined(saturation))
      return null;
    saturation = parseInt(saturation);
    if(saturation > 100 || saturation < -100)
      return null;
    return saturation;
  },
  getLightnessArg: function(args, t) {
    var lightness = args[t + "lightness"];
    if(!$defined(lightness))
      return null;
    lightness = parseInt(lightness);
    if(lightness > 100 || lightness < -100)
      return null;
    return lightness;
  },
  randSub: function(nick) {
    var getDigit = function() { return Math.floor(Math.random() * 10); }
    
    return nick.split("").map(function(v) {
      if(v == ".") {
        return getDigit();
      } else {
        return v;
      }
    }).join("");
    
  },
  parseIRCURL: function(url) {
    if(url.indexOf(":") == 0)
      return;
    var schemeComponents = url.splitMax(":", 2);
    if(schemeComponents[0].toLowerCase() != "irc" && schemeComponents[0].toLowerCase() != "ircs") {
      alert("Bad IRC URL scheme.");
      return;
    }

    if(url.indexOf("/") == 0) {
      /* irc: */
      return;
    }
    
    var pathComponents = url.splitMax("/", 4);
    if(pathComponents.length < 4 || pathComponents[3] == "") {
      /* irc://abc */
      return;
    }
    
    var args, queryArgs;
    if(pathComponents[3].indexOf("?") > -1) {
      queryArgs = qwebirc.util.parseURI(pathComponents[3]);
      args = pathComponents[3].splitMax("?", 2)[0];
    } else {
      args = pathComponents[3];
    }
    var parts = args.split(",");

    var channel = parts[0];
    if(channel.charAt(0) != "#")
      channel = "#" + channel;

    var not_supported = [], needkey = false, key;
    for(var i=1;i<parts.length;i++) {
      var value = parts[i];
      if(value == "needkey") {
        needkey = true;
      } else {
        not_supported.push(value);
      }
    }

    if($defined(queryArgs)) {
      for(var key_ in queryArgs) {
        var value = queryArgs[key_];
        
        if(key_ == "key") {
          key = value;
          needkey = true;
        } else {
          not_supported.push(key_);
        }
      }
    }
    
    if(needkey) {
      if(!$defined(key))
        key = prompt("Please enter the password for channel " + channel + ":");
      if($defined(key))
        channel = channel + " " + key;
    }
    
    if(not_supported.length > 0)
      alert("The following IRC URL components were not accepted: " + not_supported.join(", ") + ".");
    
    return channel;
  }
});
