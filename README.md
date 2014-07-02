Literally-Typed is an idea for a [literate](https://en.wikipedia.org/wiki/Literate_programming) form of [TypeScript](http://www.typescriptlang.org/).
This is a concept, and hasn't been implemented, I just have been exploring this idea.
The Literally-Typed language would consist of a set of HTML-style elements that can define a TypeScript interface within
human-targeted documentation, that can be then
be applied to plain JavaScript code to check and enforce type constraints.

Literally-Typed is based on the premise that type information is essentially a form of documentation, that is machine-readable 
(for the purpose of proving code invariants and providing other structured assistance), and consequently belongs with
natural language documentation. By applying Donald Knuth's ideas of literate programming, TypeScript can exist within
your documentation. Combining structured type-based documentation with natural descriptive documentation helps to 
unify your documentation, as well enforce consistency in documentation. By using
the Literally-Typed/TypeScript compiler, not only do you gain the code checking providing by typing, 
but further consistency is enforced as your documentation can be continuously checked
against your implementation, ensuring that all aspects of your package, including implementation, typing, and 
descriptive documentation remain in sync.

Literally-Typed would also facilitate a clean separation between your implementation which defines the internal steps of
"how" your code works, from the definition of the interface, the descriptions, both in the mechanical
syntax of TypeScript and the natural descriptions of "what" your modules and code provide for external
use. There is no need to have documentation stuffed into implementation code, nor multiple types of documentation.

Literally-Typed defines HTML elements for the various TypeScript constructs. These can elements can be defined in your
MarkDown documents, or any other type of HTML-based documentation.

Possible Future Plans

Based on interest in the project, it may be interesting to also:
* Create TypeScript definition interfaces that can be optionally retained and used by
downstream TypeScript developers.
* Parse AMD and/or CommonJS modules so that full TS inferences can be applied
and checked between modules (right now we are just are enforcing documentation-
originating interfaces on each module).