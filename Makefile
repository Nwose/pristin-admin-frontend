install:
	@echo "Installing the application..."
	npm install

runserver:
	npm run dev

diff:
	git add -N .
	git diff > a.diff
	code a.diff
	rm a.diff
	git add .
	git commit
	git push