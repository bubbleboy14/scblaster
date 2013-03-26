from subprocess import call

print 'replacing dashes with underscores and sanitizing'
call('rename -s - _ resources/media/*ogg -z', shell=True)