import { Code } from "lucide-react"

const Footer = () => {
  return (
    <footer className="p-8 border-t border-border/30">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex flex-col items-center gap-2">
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/tmdb_large.svg"
              alt="The Movie Database (TMDB) Logo"
              className="h-4"
            />
          </a>
          <p className="text-sm text-muted-foreground">
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </p>
        </div>

        <a
          href="https://github.com/FelixBruguera/movietracker-tmdb"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <Code className="h-4 w-4" />
          <p>Created by Felix Bruguera</p>
        </a>
      </div>
    </footer>
  )
}

export default Footer
