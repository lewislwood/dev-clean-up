
# Developer Clean Up Utility# dev-clean-up

This utility quickly cleans up the folder tree for all folders in that tree (includeing sub-trees).
Developers will download repositories and samples all the time, and even run them.
This creates runtime folders and more.
These folders take up space and are not needed.

At least under Ubuntu under Windows whenever you copy files via windows explorer to a linux folder, it creates these annoying zone.identifier files.
I know the files are safe, so I want them gone.  Why delte one at a time?

Just one quick utility and all is cleaned up.
Has safety features to prect you from accidents (caps lock, oops forgot something, ...).
That is why I added a confirm question and a way for the user to auto comnfirm without interaction.

sinmply with -h or --help parameter for the help screen.

## Parameters

Syntax: devCleanUp -v -t -z -y myfolderPath
  The above will be verbose about what happens, test run thus non-destructive. Zone files are being delete, and auto confirm without prompting. SWill start with the folder myfolderPath. The default is the current folder.

+ -t  : Does a test run
+ -y  Auto confirm without prompting.
+ -v verbose
+ -z  delete zone files as well
+ -d=list comma delimited list of folders to delete
+ -h  Displays the help screen

+ -i=list  Comma seperated list of folders to add to the ignore list. .git and .testdata are added      ".testdata" is my test dat I used to test the script
       This list will replace the default (dist,.next,node_modules)

## Installation

You may want to rename the file without the .sh extension.  That way you do not have to type devCleanUp.sh and can leave out the .sh.
You may need to do a "chmod +x devCleanUp.sh" to make it executable.
You can test this by typeing in the terminal the follwing:
$ ./devClenup.sh -t
The above command should do a quick run using the current folder if it is executable, otherwise do the chmod +x command.

Copy the devCleanUp.sh file to a folder in you path. (ie: /user/local/bin)
