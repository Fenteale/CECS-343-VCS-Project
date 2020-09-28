# CECS-343-VCS-Project

### How to build

Make sure you have node installed.

#### Step 1: Clone the repository

In terminal or command prompt, navigate to the folder you want to download the project to.

For example:

```
cd Documents
cd CECS343
```

Then run this to download the git repo:

```
git clone https://github.com/Fenteale/CECS-343-VCS-Project.git
```

Next, go inside the newly downloaded folder.

```
cd CECS-343-VCS-Project
```

#### Step 2: Install dependencies

Now we need to install Express.  Enter this to do so:

```
npm ci
```

### How to run

Make sure your terminal is in the project directory, then run:

```
node app.js
```

Then go to this link to make sure it's working.

http://localhost:3000/

### Usage

In the box that says "Enter input:" you can enter any command.  Current commands:

- 'create' - creates a snapshot of a source directory and outputs to a repository directory
		Usage:
		``` 
		create srcDir repoDir
		srcDir	- full path to source directory
		repoDir - full path to repository directory
		```

		Example:
		For windows:
			```
			create C:/Users/Username/Documents/Project C:/Users/Username/Documents/Repository
			```
		
		For UNIX:
			```		
			create /home/user/Documents/Project /home/user/Documents/Repository
			```