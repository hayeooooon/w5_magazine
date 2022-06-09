import React from "react";
import styled from "styled-components";

const MagazineItem = ({ page, layout, content }) => {
	const data = { ...content };
	const image_url =
		"https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg";
	return (
		<Magazine layout={layout} className={page ? page : ""} data-layout={layout}>
			<ImageArea className="img_area">
				<div className="img_box">
					{data.img ? (
						<img src={data.img} />
					) : (
						<span
							style={{
								fontSize: "13px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							이미지를 업로드해주세요.
						</span>
					)}
				</div>
			</ImageArea>
			<TextArea className="text_area">
				<h2 className="magazine_ttl">
					<strong>{data.title ? data.title : "제목을 입력해주세요."}</strong>
				</h2>
				{page !== "main" && (
					<div className="info_area view">
						<dl>
							<div className="date">
								<dt>작성일</dt>
								<dd>{data.date}</dd>
							</div>
							<div className="author">
								<dt>작성자</dt>
								<dd>{data.author}</dd>
							</div>
						</dl>
					</div>
				)}
				<p className="content">
					{data.text ? data.text : "내용을 입력해주세요."}
				</p>
				{page === "main" && (
					<div className="info_area">
						<span className="date">{data.date}</span>
						<p className="author">{data.author}</p>
					</div>
				)}
			</TextArea>
		</Magazine>
	);
};

const Magazine = styled.div`
	display: flex;
	justify-content: center;
	flex-direction: ${(props) =>
		props.layout === 0 ? "row" : props.layout === 1 ? "row-reverse" : "column"};
	margin: 0 -20px;
	.img_area {
		width: ${(props) =>
			props.layout === 0 || props.layout === 1 ? "60%" : "100%"};
		max-width: ${(props) =>
			props.layout === 0 || props.layout === 1 ? "60%" : "100%"};
		.img_box {
			position: relative;
			height: 0;
			padding-bottom: ${(props) =>
				props.layout === 0 || props.layout === 1 ? "66.666%" : "33.333%"};
			overflow: hidden;
			img {
				transition: ease-out 360ms;
			}
			img,
			span {
				position: absolute;
				min-width: 100%;
				min-height: 100%;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}
			span {
				background-color: #eee;
			}
		}
	}
	.text_area {
		width: ${(props) =>
			props.layout === 0 || props.layout === 1 ? "40%" : "100%"};
		max-width: ${(props) =>
			props.layout === 0 || props.layout === 1 ? "40%" : "100%"};
	}
	&.main:hover {
		.img_box {
			img {
				transform: translate(-50%, -50%) scale(1.02);
			}
		}
	}
	&[data-layout="0"] {
		h2 {
			width: auto;
			padding-top: 15px;
			transform: translateX(-20%);
			margin-right: -20px;
		}
	}
	&[data-layout="1"] {
		h2 {
			strong {
				/* white-space: nowrap; */
			}
		}
	}
	&[data-layout="2"] {
		h2 {
			padding-top: 20px;
		}
		.info_area.view dl{
			display: flex;
			align-items: center;
			div+div{
				margin-top: 0;
				margin-left: 20px;
				padding-left: 20px;
				border-left: 1px solid  #eee;
			}
		}
	}
	.h2 {
		font-size: 3.2rem;
		
	}
`;
const ImageArea = styled.div`
	position: relative;
	flex-basis: auto;
	padding: 0 20px;
	box-sizing: border-box;
	max-width: 50%;
	z-index: 1;
	img {
		max-width: 100%;
	}
	/* .img_box {
		width: 100%;
		padding-bottom: 62.5%;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	} */
`;
const TextArea = styled.div`
	position: relative;
	flex-basis: 100%;
	padding: 0 20px;
	box-sizing: border-box;
	z-index: 2;
	.info_area {
		display: flex;
		gap: 10px;
		font-size: 1.5rem;
		letter-spacing: 0;
		align-items: center;
		margin-top: 20px;
		p {
			font-weight: 600;
			span {
				font-weight: 400;
			}
		}
		&.view{
			display: block;
			margin-bottom: 30px;
			dl{
			& > div{
				font-size: 1.4rem;
				display: flex;
				align-items: center;
				line-height: 2rem;
				dt{
					opacity: .7;
				}
				dd{
					margin-left: 15px;
					font-weight: 500;
				}
				& + div{
					margin-top: 10px;
					margin-top: 3px;
				}
			}
		}
		}
	}
	.content {
		font-size: 1.8rem;
		line-height: 1.5;
	}
	h2 {
		font-size: 3.2rem;
		margin-bottom: 20px;
		padding-top: 10px;
		strong {
			position: relative;
			display: inline-block;
			line-height: 1.3;
			padding-bottom: 2px;
			border-bottom: 3px solid #333;
			::before {
				content: "";
				position: absolute;
				left: -10px;
				right: -10px;
				top: 50%;
				bottom: -10px;
				background: #fff;
				z-index: -1;
			}
		}
	}
`;
export default MagazineItem;
