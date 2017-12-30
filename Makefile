dbg:
	@echo "Copying files ..."
	@cp src/index.html build/index.html
	@cp src/wad.min.js build/wad.min.js
	@echo "Compiling TS -> JS ..."
	@tsc

prod: dbg
	@echo "Mangling JS ..."
	@uglifyjs --compress --mangle toplevel,eval -o build/app.js -- build/app.js

clean:
	@echo "Cleaning build/ dir ..."
	@rm -rdf build/*