const TicTacToe = () => {
    const rows = 3;
    const cols = 3;

    const CreateField = () => {
        let field = [];
        for(let i = 0; i < rows; i++) {
            console.log("row create");
            let row = [];
            for(let j = 0; j < cols; j++) {
                console.log("cell create");
                row.push(<div className="row__cell"></div>);
            }
            field.push(<div className="row">{row}</div>);
        }
        return <div className="game__field">{field}</div>
    }

    return(
        <div>
            <CreateField />
        </div>
    );
}

export default TicTacToe;