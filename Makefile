.DEFAULT_GOAL := app

OUTDIR = out
CXX = tsc

ALLLIBS = $(OUTDIR)/lib/libcpu.js $(OUTDIR)/lib/libdisplay.js $(OUTDIR)/lib/libmemory.js $(OUTDIR)/lib/libwad.js

$(OUTDIR)/lib/libcpu.js: src/cpu/loader.ts
	$(CXX) src/cpu/loader.ts --outFile $(OUTDIR)/lib/libcpu.js

$(OUTDIR)/lib/libdisplay.js: src/display/display.ts
	$(CXX) src/display/display.ts --outFile $(OUTDIR)/lib/libdisplay.js

$(OUTDIR)/lib/libmemory.js: src/memory/memory.ts
	$(CXX) src/memory/memory.ts --outFile $(OUTDIR)/lib/libmemory.js

$(OUTDIR)/lib/libwad.js: src/third_party/wad.min.js
	cp src/third_party/wad.min.js $(OUTDIR)/lib/libwad.js

$(OUTDIR)/index.html: src/app/index.html 
	cp src/app/index.html $(OUTDIR)/index.html


app_debug: $(ALLLIBS)  $(OUTDIR)/index.html src/app/main.ts
	tsc --allowJS src/app/main.ts $(ALLLIBS) --outFile $(OUTDIR)/app.js

app: app_debug
	uglifyjs --compress --mangle toplevel,eval -o out/app.js -- out/app.js


clean:
	@echo Cleaning out/ dir ...
	@rm -rf out/*
	@rm -rf out/lib/*


test: $(OUTDIR)/lib/libcpu.js
	@echo test