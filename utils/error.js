function error(msg) {
	throw( new Error(`
    ------------------
    ${msg}
    ------------------
    `));
}

module.exports = error;
