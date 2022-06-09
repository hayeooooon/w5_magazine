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
					<img src={data.img} />
				</div>
			</ImageArea>
			<TextArea className="text_area">
				<h2 className="magazine_ttl">
					<strong>{data.title}</strong>
				</h2>
				<p className="content">{data.text}</p>
				<div className="info_area">
					<span className="date">{data.date}</span>
					<p className="author">{data.author}</p>
				</div>
				<span className="readmore">
					Read More <i></i>
				</span>
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
				position: absolute;
				min-width: 100%;
				min-height: 100%;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}
		}
	}
	.text_area {
		width: ${(props) =>
			props.layout === 0 || props.layout === 1 ? "40%" : "100%"};
		max-width: ${(props) =>
			props.layout === 0 || props.layout === 1 ? "40%" : "100%"};
	}
	&:hover {
		.readmore {
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
	&[data-layout="0"] {
		h2 {
			transform: translateX(-20%);
		}
	}
	&[data-layout="1"] {
		h2 {
			strong {
				white-space: nowrap;
			}
		}
	}
	&[data-layout="2"] {
		h2 {
			padding-top: 20px;
		}
	}
	.h2 {
		font-size: 32px;
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
		margin-top: 14px;
		p {
			font-weight: 600;
			span {
				font-weight: 400;
			}
		}
	}
	.content {
		font-size: 1.8rem;
		line-height: 1.5;
	}
	.readmore {
		display: inline-block;
		float: right;
		vertical-align: middle;
		font-size: 1.3rem;
		margin-top: 25px;
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
				transition: margin ease-out 260ms, width ease-out 260ms,
					height ease-out 260ms;
			}
		}
	}
	h2 {
		font-size: 3.2rem;
		margin-bottom: 20px;
		padding-top: 10px;
		strong {
			position: relative;
			display: inline-block;
			line-height: 1.3;
			padding-bottom: 4px;
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
