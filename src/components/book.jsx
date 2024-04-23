import React, { useState, useEffect } from "react";
import { BiChevronLeft } from "react-icons/bi";
import { BiChevronRight } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import settings from "@/setting/settings.json";

export function Book() {
  const [currentPage, setCurrentPage] = useState("default.html");
  const [pageContent, setPageContent] = useState("");
  const [current, setCurrent] = useState(1)
  const [pages, setpages] = useState([])
  const [humburgerMenu, setHumburgerMenu] = useState(settings.tableOfContents)
  useEffect(() => {
    setCurrentPage(pages[current-1])
    console.log(pages)
    console.log(pages.length)
    if(currentPage){
      const pagePath = `/pages/${currentPage}`;
    fetch(pagePath)
      .then((response) => response.text())
      .then((data) => setPageContent(data))
      .catch((error) => console.error("Error fetching page content:", error));
    switch (current) {
      case 1:
        document.getElementById('back').classList.add('disabled')
        document.getElementById('forward').classList.remove('disabled')
        break;
      case pages.length:
        document.getElementById('forward').classList.add('disabled')
        document.getElementById('back').classList.remove('disabled')
        break;
      default:
        document.getElementById('back').classList.remove('disabled')
        document.getElementById('forward').classList.remove('disabled')

        break;
    }
    
    }
  }, [currentPage, current, pages]);
  useEffect(()=>{
    
    if(settings.pageSaver){
      if(localStorage.getItem(settings.title + "_pagesaver") !== null){
        const page = parseInt(localStorage.getItem(settings.title + "_pagesaver"))
        setCurrent(page)

      }
    }
    fetch("/api/pagesRender").then(res=>res.json()).then(data=>setpages(data))
  }, [])
  const back = ()=>{
    if(!document.getElementById('back').classList.contains('disabled')) {
      setCurrent((prevCurrent) => prevCurrent - 1);
      localStorage.setItem(settings.title + "_pagesaver", current - 1)

    }
    
  }
  const forward = ()=>{
    if(!document.getElementById('forward').classList.contains('disabled')) {
      setCurrent((prevCurrent) => prevCurrent + 1);
      localStorage.setItem(settings.title + "_pagesaver", current + 1)
    }
  }
  return (
    <main id="book">
      <header>
        <a>{settings.title}</a>
        <div className={humburgerMenu ? "show-menu" : "hide-menu"}>
          {
            pages.map((page, index) => {
              return <a key={index} onClick={()=>setCurrent(index+1)}>{page}</a>
            })
          }
         
        </div>
        <a id="humburger-icon" onClick={() => {
          setHumburgerMenu(!humburgerMenu)
        }}>
          <GiHamburgerMenu />
        </a>
      </header>
      <iframe title="book-page" srcDoc={pageContent}></iframe>
      <footer>
        <span id="forward" onClick={forward}>
          <BiChevronLeft />
        </span>
        <div>
        <h2 onClick={() => setCurrentPage('default.html')}>{settings.title}</h2>
        <p>Created by {settings.author}</p>
        <p>{pages.length}/
            <input type="number" min="1" max={pages.length} onChange={(e) => {
              const pageNo = parseInt(e.target.value)
          if(pageNo <= 0 || pageNo > pages.length){
            e.target.classList.add('error')
          }else{
            e.target.classList.remove('error')
            setCurrent(pageNo)
          }
        }} value={current} style={{width: '50px'}}></input>
        </p>
        </div>
        <span id="back" onClick={back}>
          <BiChevronRight />
        </span>
      </footer>
    </main>
  );
}
