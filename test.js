function mxCell(value)
{
	this.value = value;
	
};

let cell = new mxCell("Hello, World!");

console.log(cell.constructor);

const foo = {
	a: 1,

}

foo.b = () => {
	return foo.a
}
console.log(foo.b());