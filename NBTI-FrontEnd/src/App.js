import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Body } from './components/Body/Body';
import axios from 'axios';
import { useAuthStore, useMemberStore, useNotification, useCheckList } from './store/store';
import { useEffect, useContext } from 'react';
import ChatApp from './components/ChatApp/ChatApp';
import { ChatsProvider ,ChatsContext} from './Context/ChatsContext';
import { host } from './config/config';
import { Slide, ToastContainer } from'react-toastify';
import { useRef } from 'react';
import styles from './App.module.css';

axios.defaults.withCredentials = true;

function App() {
  const { loginID, setLoginID } = useAuthStore();
  const { setMembers } = useMemberStore();
  const websocketRef=useRef(null);
  const {maxCount,count} =useNotification();
  const {webSocketCheck,onMessage,chatController} =useCheckList();
  const [unread,setUnread] =useState();


  useEffect(() => {
    setLoginID(sessionStorage.getItem("loginID"));
  }, []); // 의존성 배열에 setMembers 추가

  useEffect(() => {
    if (loginID !== null && loginID!=='error') {
      axios.get(`${host}/members/selectAll`)
        .then((resp) => {
          const filteredMembers = resp.data.map(({ pw, ...rest }) => rest);
          setMembers(filteredMembers);
          console.log('Fetched Members:', filteredMembers);
        })
    }
  }, [loginID])

  //웹소켓 전체 관리
  useEffect(()=>{
    if (loginID !== null&& loginID!=='error') {
      const url=host.replace(/^https?:/, '')
      websocketRef.current = new WebSocket(`${url}/chatWebsocket`);
    }
    if(websocketRef.current!=null){
      websocketRef.current.onopen = () => {
        console.log('Connected to WebSocket');
      }
    }
 

    return () => {
      if(websocketRef.current!=null){
        websocketRef.current.close();
      }
    };
  },[loginID,webSocketCheck]);

  useEffect(()=>{
    if(loginID!=null&& loginID!=='error'){
      axios.get(`${host}/chat/unread`).then((resp)=>{
        console.log(resp.data);
        setUnread(parseInt(resp.data));
      })
    }

  },[onMessage,loginID,chatController])
  return (
    <ChatsProvider>
      <Router>
        <div className="container">
          {(loginID!=null&& loginID!=='error')&& <Header />}
          <Body />
          {(loginID!=null&& loginID!=='error')&&<ChatApp websocketRef={websocketRef}></ChatApp>}
          
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          //pauseOnHover
          limit={maxCount}
          transition={Slide}
        />
      </Router>
      {(unread>0&&(loginID !== null && loginID!=='error'))&&(<div className={styles.unread}>{unread}+</div>)}
    </ChatsProvider>
  );
}

export default App;
