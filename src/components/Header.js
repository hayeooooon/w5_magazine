import React, { useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useDispatch } from "react-redux";

import { auth } from "../modules/firebase";
import Button from "./Button";
import {getUserFB} from '../modules/redux/magazineItems';

function Header({ isLogin, nickname, setIsLogged }) {
	const dispatch = useDispatch();
	return (
		<>
			<HeaderStyle>
				<div className="inner">
					<h1>
						<Link to="/">Magazine</Link>
					</h1>
					<ul className="functions">
						{!isLogin && (
							<li>
								<Link to="/signin">로그인</Link>
							</li>
						)}
						{!isLogin && (
							<li>
								<Link to="/signup">회원가입</Link>
							</li>
						)}
						{isLogin && (
							<li className="user">
								<Link to="/mypage">{nickname}</Link> 님
							</li>
						)}
						{isLogin && (
							<li>
								<Button type="button" st="text" onClick={() => {
									signOut(auth);
									dispatch(getUserFB(null));
									setIsLogged(false);
								}}>
									로그아웃
								</Button>
							</li>
						)}
					</ul>
				</div>
			</HeaderStyle>
		</>
	);
}

const HeaderStyle = styled.header`
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	height: 55px;
	box-sizing: border-box;
	background: #f0f0f0;
	z-index: 2;
	.inner {
		display: flex;
		justify-content: space-between;
	}
	h1 {
		font-size: 2.2rem;
		line-height: 55px;
	}
	.functions {
		display: flex;
		justify-content: space-around;
		align-items: center;
		gap: 30px;
	}
	li a {
		display: inline-block;
		font-size: 1.5rem;
		background-color: transparent;
		color: #333;
		height: auto;
		line-height: 1.2;
		font-weight: 700;
	}
	li.user {
		position: relative;
		&:before{
			content: '';
			position: absolute;
			right: -15px;
			top: 50%;
			width: 1px;
			height: 14px;
			background-color: rgba(0,0,0,.2);
			margin-top: -7px;
		}
		a {
			border-bottom: 1px solid #333;
			padding-bottom: 2px;
			margin-top: -3px;
			transform: translateY(-1px);
		}
	}
`;

export default Header;
