import os
from subprocess import call

def process(targets, dirname, fnames):
	print "replacing black backgrounds with transparency"
	for target in targets:
		hits = [os.path.join(dirname, fname) for fname in fnames if fname.startswith(target)]
		for fpath in hits:
			print ' - converting', fpath
			call('convert -transparent black -fuzz 10%% %s png32:%s'%(fpath, fpath), shell=True)

os.path.walk('resources/images', process, ['explosion1', 'explosion3', 'playerthrust'])