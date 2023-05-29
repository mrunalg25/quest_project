import { Button, Tab, Tabs, TextField, ThemeProvider, createTheme } from "@mui/material";
import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";
import { useEffect } from "react";
import CustomPagination from "../../components/Pagination/CustomPagination";
import SingleContent from "../../components/SingleContent/SingleContent";

const Search= () =>{

    const [type, setType]= useState(0);
    const [page, setPage]= useState(1);
    const[searchText, setSearchText]= useState("");
    const[content, setContent]= useState();
    const[numOfPages, setNumOfPages]= useState();

    const darkTheme= createTheme({
        palette:{
            type: "dark",
            primary: {main: "#ffffff"}
        }
    })

    const fetchSearch= async()=> {
        const {data} = await axios.get(
            `https://api.themoviedb.org/3/search/${type ? "tv" : "movie"}?api_key=${process.env.REACT_APP_API_KEY}&query=${searchText}&page=${page}`
        );

        setContent(data.results);
        setNumOfPages(data.total_pages);

    }

    useEffect(()=>{
        window.scroll(0,0);
        fetchSearch()
    }, [type, page])




    return(
        <div>
            <ThemeProvider theme= {darkTheme}>
            <div style= {{display: "flex", margin: '15px 0'}}>
                <TextField
                    style={{flex: 1}}
                    className= "searchBox"
                    label= "Search"
                    variant= "filled"
                    onChange={(e)=> setSearchText(e.target.value)}
                />
                <Button variant='contained' style={{marginLeft: 10}} onClick={fetchSearch}> <SearchIcon/> </Button>
            </div>
            <Tabs 
                value={type} 
                indicatorColor='primary' 
                textColor= 'primary'
                onChange={(event, newValue) =>{
                    setType(newValue);
                    setPage(1);
                }}
            >
                <Tab style={{width: "50%"}} label="Search Movies" />
                <Tab style={{width: "50%"}} label="Search TV Series" />

            </Tabs>
                
            </ThemeProvider>
            <div className="trending">
                {
                    content && content.map((c)=> (
                        <SingleContent 
                            key={c.id} 
                            id={c.id} 
                            poster={c.poster_path} 
                            title={c.title || c.name} 
                            date={c.first_air_date || c.release_date}
                            media_type={type ? "tv" : "movie"}
                            vote_average={c.vote_average}

                        />))
                }
                {searchText && 
                !content &&
                (type ? <h2>No Series found</h2> : <h2>No Movies found</h2>)}
            </div>
            {numOfPages> 1 && <CustomPagination setPage={setPage} numOfPages={numOfPages}/>}
            
        </div>
    );
};

export default Search;