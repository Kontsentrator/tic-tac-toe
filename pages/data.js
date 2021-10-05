const DataList = ({data}) => {
    return(
        <div>
            {data.map(el => 
                <div key={el.id}>
                    <p>{el.id}</p>
                    <p>{el.status}</p>
                </div>
            )}
        </div>
    );
}

export default DataList;

export async function getStaticProps() {
    const response = await fetch("http://localhost:3000/api/user");
    const data = await response.json();
    console.log(data);

    return {
        props: {
            data,
        }
    }
}