from subprocess import call

print 'removing redundant m4a files'
call('rm resources/media/*m4a', shell=True)

print 'renaming necessary ogg files to mp3 and sanitizing'
call('rename -s ogg mp3 resources/media/*ogg -z', shell=True)

print 'replacing dashes with underscores'
call('rename -s - _ resources/media/*', shell=True)