
function Result(result: any, openDetail: any ) {
  return (
    <div className="result" onClick={() => openDetail(result.imdbID)}>
      <img src={result.Poster} />
      <h3>{result.Title}</h3>
    </div>
  );
}

export default Result;
