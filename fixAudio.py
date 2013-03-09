from subprocess import call

print 'renaming ogg files to mp3 and sanitizing'
call('rename -s ogg mp3 resources/media/*ogg -z', shell=True)

print 'replacing dashes with underscores'
call('rename -s - _ resources/media/*mp3', shell=True)