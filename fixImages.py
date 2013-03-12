import os
from subprocess import call

def process(imgs, dirname, fnames):
	print "replacing black backgrounds with transparency"
	for img in imgs:
		hits = [os.path.join(dirname, fname) for fname in fnames if fname.startswith(img)]
		for fpath in hits:
			print ' - converting', fpath
			call('convert -transparent black -fuzz 10%% %s png32:%s'%(fpath, fpath), shell=True)

os.path.walk('resources/images', process, ['explosion1', 'explosion3', 'playerthrust'])