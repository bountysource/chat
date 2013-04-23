with (scope('Connect')) {

  define('show', function(parentElement, callback, initialNickname, initialChannels, autoConnect, autoNick, networkName) {
    var nick_input = text({ 'class': 'input-text input-medium', name: 'nick', style: 'margin: 0 10px', placeholder: initialNickname });

    render({ into: parentElement},
      p({ style: 'text-align: center; padding-top: 10px' }, "The #Bountysource IRC Chatroom is a place to communicate with other Bountysource users."),

      form({ style: 'text-align: center; padding-top: 10px', action: curry(process, callback, parentElement, nick_input) },
        span("Nickname:"),
        nick_input,
        submit({ 'class': 'btn btn-success' }, "Connect")
      )
   );

    nick_input.focus();
  });
  qwebirc.ui.GenericLoginBox = show;

  define('process', function(callback, parentElement, nick_input, form_data) {
    callback({
      "nickname": nick_input.value || nick_input.placeholder,
      "autojoin": '#warren'
    });
  });

}


//qwebirc.ui.LoginBox = function(parentElement, callback, initialNickname, initialChannels, networkName) {
//  var p = new Element("p");
//  p.set("html", "The Bountysource chatroom is a place to communicate with other Bountysource users.");
//  p.style.textAlign = 'center';
//  p.style.paddingTop = '40px';
//  parentElement.appendChild(p);
//
//  p = new Element("p");
//  p.set("html", "Bountysource staff have an @ in front of their nickname.  This is #bountysource on irc.freenode.net.");
//  p.style.textAlign = 'center';
//  parentElement.appendChild(p);
//
//  var form = new Element("form");
//  form.style.paddingTop = '20px';
//  form.style.textAlign = 'center';
//  parentElement.appendChild(form);
//  var span = new Element("span");
//  span.set("html", "Nickname: ");
//  form.appendChild(span);
//
//  var nick = new Element("input");
//  nick.set("placeholder", initialNickname);
//  nick.set("type", 'text');
//  nick.addClass('input-text input-medium');
//  nick.style.margin = '0 10px';
//  form.appendChild(nick);
//  nick.focus();
//
//  var connbutton = new Element("input", {"type": "submit"});
//  connbutton.set("value", "Connect");
//  connbutton.addClass('btn btn-success');
//
//  form.addEvent('submit', function() {
//    callback(data = {"nickname": nick.value || nick.placeholder, "autojoin": '#warren'});
//  });
//
//  form.appendChild(connbutton);
//}

