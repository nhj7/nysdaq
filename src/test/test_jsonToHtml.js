function tableGenerator(data) { // data is an array
    let html = ``;
    var keys = Object.keys(Object.assign({}, ...data));// Get the keys to make the header
    // Add header
    var head = '<thead><tr>';
    keys.forEach(function (key) {
        head += '<th>' + key + '</th>';
    });
    html = html.concat(head + '</tr></thead>');
    // Add body
    var body = '<tbody>';
    data.forEach(function (obj) { // For each row
        var row = '<tr>';
        keys.forEach(function (key) { // For each column
            row += '<td>';
            if (obj.hasOwnProperty(key)) { // If the obj doesnt has a certain key, add a blank space.
                row += obj[key];
            }
            row += '</td>';
        });
        body += row + '<tr>';
    })
    html = html.concat(body + '</tbody>');
    return html;
}

const data = [
    {"aa":"11"}
    , {"bb":"22"}
]

const html = tableGenerator(data);

console.log(html);