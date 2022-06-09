import React, { useState } from "react";
import styled, {keyframes} from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Button from "./Button";
import ic_heart from "../images/ic_heart.png";
import ic_heart_gray from "../images/ic_heart_gray.png";
import ic_heart_big from "../images/ic_heart_big.png";
import MagazineItem from "./MagazineItem";
import { loadMagazineFB, updateLikeFB } from "../modules/redux/magazineItems";

const Main = ({ id, isLogin }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const datas = useSelector((state) => state.magazineItems.list);
	const [ani_in, setAni_in] = useState('')
	const likeAnimation = (like) => {
		if(isLogin){
			if(like){
				setAni_in('ani_on');
				setTimeout(()=>setAni_in(''), 800)
			}else{
				setAni_in('');
			}
		}
	}
	if (datas.length > 0) {
		return (
			<Contents className={`contents ${ani_in}`}>
				<ContentTop>
					<h2>동네의 <strong>단골 스팟</strong>을 소개해주세요!</h2>
					<Button onClick={()=>{navigate('/write')}}>새 포스트 올리기</Button>
				</ContentTop>
				<MagazineGroup>
					{datas.map((v, i) => {
						return (
							<li key={i}>
								<Link to={`/view/${v.id}`}>
									<MagazineItem
										page="main"
										layout={v.layout}
										content={{
											title: v.title,
											author: v.author,
											date: v.date,
											text: v.text,
											img: v.img,
											user: v.user,
											like: v.like,
											like_on: v.like_on,
										}}
									/>
								</Link>
								<div className="func" data-layout={v.layout}>
									<span className="like_btn">
										<button
											type="button"
											onClick={() => {
												!isLogin
													? window.alert(
															"좋아요 기능은 로그인 후 사용 가능합니다."
													  )
													: dispatch(updateLikeFB(v.id, id));
														likeAnimation(!v.like_on);
											}}
										>
											<img
												src={v.like_on ? ic_heart : ic_heart_gray}
												alt="like"
											/>
										</button>
										<p>
											좋아요 <strong>{v.like.length}</strong>개
										</p>
									</span>
									<span className="readmore">
										Read More <i></i>
									</span>
								</div>
							</li>
						);
					})}
				</MagazineGroup>
			</Contents>
		);
	} else {
		return (
			<NoData className="contents">
				<h3>등록된 게시글이 없습니다.</h3>
				<div>
					<Button onClick={()=>{navigate('/write')}}>새 포스트 올리기</Button>
				</div>
			</NoData>
		);
	}
};

const heartAnimation = keyframes`
  0% {
		transform: translateY(-50%) scale(.5);
    opacity: 0;
  }
	30% {
    opacity: .8;
  }
	40%{
		opacity: 1;
		transform: translateY(-50%) scale(1.4);
	}
	50%{
		opacity: 1;
		transform: translateY(-50%) scale(1.3);
	}
	60% {
    opacity: 1;
		transform: translateY(-50%) scale(.8);
  }
	65% {
    opacity: 1;
		transform: translateY(-50%) scale(1.1);
  }
	80%{
		opacity: 1;
		transform: translateY(-50%) scale(1.3);
	}
	90%{
		opacity: 1;
		transform: translateY(-50%) scale(1.2);
	}
  100% {
    opacity: 0;
		transform: translateY(-50%) scale(.5);
  }
`
const Contents = styled.div`
	&.ani_on::before{
		content: '';
		display: block;
		position: fixed;
		left: 0;
		right: 0;
		top: 50%;
		width: 90px;
		height: 90px;
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
		background-image: url(${ic_heart_big});
		margin: 0 auto;
		z-index: 5;
		animation-duration: 630ms;
		animation-timing-function: ease-in-out;
		animation-fill-mode: forwards;
		animation-name: ${heartAnimation}
	}
	&.ani_on::before{
		
	}
`
const ContentTop = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	text-align: right;
	padding-bottom: 20px;
	border-bottom: 1px solid #333;
	margin-bottom: 70px;
	h2{
		font-size: 2.4rem;
		letter-spacing: -.04em;
		font-weight: 400;
	}
`;
const MagazineGroup = styled.ul`
	li + li {
		margin-top: 100px;
		padding-top: 100px;
		border-top: 1px solid #333;
	}
	li > a {
		pointer-events: none;
		.img_box,
		.magazine_ttl,
		.content,
		.info_area,
		.readmore,
		.func button {
			pointer-events: auto;
		}
		h2{
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			width: 100%;
			max-height: 2.6em;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		&:hover {
			& + .func .readmore {
				i {
					width: 70px;
					margin-right: 0;
					&::before {
						width: 5px;
						height: 5px;
						margin-top: -3px;
						border-top-width: 1px;
						border-right-width: 1px;
					}
				}
			}
		}
		.content{
			display:-webkit-box;
			-webkit-line-clamp:8;
			-webkit-box-orient:vertical;
			width:100%;
			max-height:12em;
			overflow:hidden;
			text-overflow:ellipsis;
			@media (max-width: 1280px) {
				-webkit-line-clamp:5;
				-webkit-box-orient:vertical;
				width:100%;
				max-height:7.5em;
			}
		}
	}
	.func {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 10px;
		&[data-layout="0"],
		&[data-layout="1"] {
			width: 40%;
			margin-top: -25px;
			box-sizing: border-box;
		}
		&[data-layout="0"] {
			padding-left: calc(60% + 10px);
			padding-right: 10px;
			width: 100%;
			margin-left: 5px;
		}
		&[data-layout="1"] {
			padding-right: 40px;
			margin-left: -10px;
		}
		&[data-layout="2"] {
			justify-content: flex-end;
			gap: 30px;
		}
		.like_btn {
			display: flex;
			align-items: center;
			font-size: 1.4rem;
			button {
				background-color: transparent;
				width: 40px;
				cursor: pointer;
				img {
					vertical-align: middle;
				}
			}
			p {
				display: inline-block;
				vertical-align: middle;
				opacity: 0.5;
				line-height: 3rem;
				strong {
					display: inline-block;
					padding: 0 2px 0 4px;
					font-weight: 500;
					vertical-align: middle;
					margin-top: -3px;
				}
			}
		}
		.readmore {
			display: inline-block;
			float: right;
			vertical-align: middle;
			font-size: 1.3rem;
			/* margin-top: 25px; */
			opacity: 0.5;
			i {
				display: inline-block;
				position: relative;
				width: 40px;
				height: 1px;
				margin-right: 30px;
				margin-left: 10px;
				vertical-align: middle;
				background: #333;
				transition: ease-out 0.3s;
				opacity: 0.7;
				&::before {
					content: "";
					position: absolute;
					right: 0;
					top: 50%;
					width: 0;
					height: 0;
					margin-top: 0;
					border-top: 0px solid #333;
					border-right: 0px solid #333;
					transform: rotate(45deg);
					transition: margin ease-out 360ms, width ease-out 360ms,
						height ease-out 360ms;
				}
			}
		}
	}
`;
const NoData = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	flex-direction: column;
	h3 {
		font-size: 1.8rem;
		font-weight: 400;
	}
	& > div{
		margin-top: 30px;
	}
`;


export default Main;
