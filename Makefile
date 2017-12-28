all:
	cp src/index.html build/index.html
	tsc
clean:
	rm -rdf build/*