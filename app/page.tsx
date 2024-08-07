import Link from "next/link";

export default function Home() {
  return (
    <>
      <div id="content">
        <div id="grid-content">
          <Link href="/movies/">
            <div className="card" id="moviesCard">
              <div className="title"><h3>Movies</h3></div>
            </div>
          </Link>
          <Link href="/comics/">
            <div className="card" id="comicsCard">
              <div className="title"><h3>Comics</h3></div>
            </div>
          </Link>
          <Link href="/animation/">
            <div className="card" id="animationCard">
              <div className="title"><h3>Animation</h3></div>
            </div>
          </Link>
          <Link href="/books/">
            <div className="card" id="booksCard">
              <div className="title"><h3>Books</h3></div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
