import React, {useEffect, useState, useRef} from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Button from "./Button";
import MagazineItem from "./MagazineItem";
import {loadthisMagazineFB,deleteMagazineFB} from "../modules/redux/magazineItems";

const View = () => {
  const navigate = useNavigate();
	const dispatch = useDispatch();
	const id = useParams().id;
	const get_datas = useSelector((state) => state.magazineItems);
	const get_user = useSelector((state) => state.magazineItems.user);

	// const get_view = useSelector((state) => state.magazineItems.view);
	const [userID, setUserID] = useState(null);
	const [data, setData] = useState(null);
	const [allData, setAllData] = useState(null);
	const [this_user, setThis_user] = useState(null);
	useEffect(() => {
		if (get_datas.view.length <= 0) {
			dispatch(loadthisMagazineFB(id, false)); // 마운트 될 때 dispatch
		} else {
			setData(get_datas.view[0]);
			setAllData(get_datas);
		}
	}, [get_datas]);

	useEffect(() => {
		if (get_user[0]?.email === undefined) {
			dispatch(loadthisMagazineFB(id, false)); // 마운트 될 때 dispatch
		} else {
			setThis_user(get_user);
		}
	}, [get_user]);


	useEffect(()=>{
		return () => {
			dispatch(loadthisMagazineFB(id, true))
			setData(null);
			setThis_user(null);
			setAllData(null);
		}
	},[])
	
	return (
		<div className="contents">
			<section>
				{
					data && <MagazineItem
					page="view"
					layout={data.layout}
					content={{
						title: data.title,
						author: data.author,
						date: data.date,
						text: data.text,
						img: data.img,
						user: data.user,
						like: data.like,
						like_on: data.like_on
					}}
				/>
				}
				
					{
						(get_user[0]?.email && get_user[0]?.email === get_datas?.view[0]?.user) && 
						<div className="btn_area btns">
						<Button width="m" onClick={()=>navigate('/')}>목록으로</Button>
						<div>
						<Button onClick={()=>{dispatch(deleteMagazineFB(id))}}>삭제</Button>
						<Button st="primary" onClick={()=>navigate(`/edit/${id}`)}>수정</Button>
						</div>
						</div>
					}
					{
						(!get_user[0]?.email || (get_user[0]?.email !== get_datas?.view[0]?.user)) && <div className="btn_area">
							<Button width="m" onClick={()=>navigate('/')}>목록으로</Button>
							</div>
					}
			</section>
		</div>
	);
};

export default View;
