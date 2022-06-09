import "./App.css";
import React, {useState, useEffect, useRef} from 'react';
import styled from "styled-components";
import { Routes, Route } from "react-router-dom";
import {onAuthStateChanged} from 'firebase/auth';
import {collection, getDocs, updateDoc} from 'firebase/firestore';
import { useSelector, useDispatch } from "react-redux";

import Header from "./components/Header";
import Main from "./components/Main";
import Write from "./components/Write";
import View from "./components/View";
import Register from "./components/Register";

import {auth, db} from './modules/firebase';
import {getUserFB} from './modules/redux/magazineItems';

function App() {
	const user_data = useSelector(state=>state.magazineItems.user)[0];
	const [userID, setUserID] = useState(null);
	const dispatch = useDispatch();
	const [isLogged, setIsLogged] = useState(false);
	const isLoggedin = async (user) => {
		if (user) {
			const email = user.email;
			setIsLogged(true);
			dispatch(getUserFB(email));
		} else {
			setIsLogged(false);
			dispatch(getUserFB(null));
		}
	}

	useEffect(() => {
		onAuthStateChanged(auth, isLoggedin);
	}, []);
	useEffect(() => {
		setUserID(user_data ? user_data.id : null);
	}, [user_data]);
	
	
	return (
		<Wrap className="App">
			<Header isLogin={isLogged} nickname={user_data?.nickname} setIsLogged={setIsLogged}/>
			<Container className="container">
				<div className="inner">
					<Routes>
						<Route path="/" element={<Main id={userID} isLogin={isLogged} />}></Route>
						<Route path="/signin" element={<Register type="signin" />}></Route>
						<Route path="/signup" element={<Register type="signup" />}></Route>
						<Route path="/write" element={<Write nickname={user_data?.nickname} userID={user_data?.email} type="write"/>}></Route>
						<Route path="/view/:id" element={<View />}></Route>
						<Route path="/edit/:id" element={<Write nickname={user_data?.nickname} userID={user_data?.email} type="edit"/>}></Route>
					</Routes>
				</div>
			</Container>
		</Wrap>
	);
}

const Wrap = styled.div`
	padding-top: 55px;
`;
const Container = styled.div`
	position: relative;
	padding: 120px 0;
	z-index: 1;
`;
export default App;
