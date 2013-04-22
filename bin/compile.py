#!/usr/bin/env python
import dependencies
dependencies.vcheck()

import pages, os, subprocess, pagegen, shutil, sys, time

def main(outputdir=".", produce_debug=True):
  ID = pagegen.gethgid()
  
  #pagegen.main(outputdir, produce_debug=produce_debug)

  coutputdir = os.path.join(outputdir, "compiled")
  try:
    os.mkdir(coutputdir)
  except:
    pass

def has_compiled():
  try:
    f = open(".compiled", "r")
    f.close()
    return True
  except:
    pass
    
  try:
    f = open(os.path.join("bin", ".compiled"), "r")
    f.close()
    return True
  except:
    pass
  
  return False
  
def vcheck():
  if has_compiled():
    return
    
  print >>sys.stderr, "error: not yet compiled, run compile.py first."
  sys.exit(1)
  
if __name__ == "__main__":
  main()
  