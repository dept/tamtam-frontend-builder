function error(msg, warn = false) {
    const styledMsg = `
    ------------------
    ${msg}
    ------------------
    `;

    if ( !warn ) throw( new Error(styledMsg));
    else console.warn( styledMsg );
}

module.exports = error;
