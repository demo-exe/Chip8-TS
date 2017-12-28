all:
	@echo "Copying HTML ..."
	@cp src/index.html build/index.html
	@echo "Compiling TS -> JS ..."
	@tsc
	@echo "Mangling JS ..."
	@uglifyjs --compress --mangle toplevel,eval -o build/app.js -- build/app.js
clean:
	@echo "Cleaning build/ dir ..."
	@rm -rdf build/*