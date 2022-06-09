import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "../modules/firebase";
import styled from "styled-components";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import image_0 from "../images/layout_1.png";
import image_1 from "../images/layout_2.png";
import image_2 from "../images/layout_3.png";
import Button from "./Button";
import MagazineItem from "./MagazineItem";
import {
	createMagazineFB,
	loadthisMagazineFB,
	updateMagazineFB,
} from "../modules/redux/magazineItems";

const Write = ({ nickname, userID, type }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const doc_id = useParams().id;
	const img_files = [image_0, image_1, image_2];
	const [layout, setLayout] = useState([true, false, false]);
	const [filename, setFilename] = useState("이미지 파일을 선택해주세요!");
	const file = useRef();
	const file_link_ref = useRef(null);
	const textarea = useRef();
	const title = useRef();
	const noImage = useRef(true);
	const [titleText, setTitleText] = useState(title.current?.value);
	const [descText, setDescText] = useState(textarea.current?.value);
	const [imgFile, setImgFile] = useState(file.current?.files.length);
	const datas = useSelector((state) => state.magazineItems);

	const getDate = () => {
		const _date = new Date();
		const year = _date.getFullYear();
		const month =
			_date.getMonth() + 1 < 10
				? "0" + (_date.getMonth() + 1)
				: _date.getMonth() + 1;
		const date = _date.getDate() < 10 ? "0" + _date.getDate() : _date.getDate();
		const day = _date.getDay();
		const dayArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		const result = `${year}-${month}-${date}, ${
			dayArr[day]
		}, ${_date.getHours()}:${_date.getMinutes()}`;
		return result;
	};
	const [content, setContent] = useState({
		layout: 0,
		title: title.current?.value,
		author: nickname,
		date: getDate(),
		text: textarea.current?.value,
		img: file_link_ref.current?.url,
		user: userID,
	});
	useEffect(() => {
		if (type === "write") {
			setContent((prev) => {
				return { ...prev, author: nickname, user: userID };
			});
		}
	}, [nickname, userID]);

	const fillInputs = () => {};
	useEffect(() => {
		if (type === "edit" && datas.view.length > 0 && datas.user.length > 0) {
			title.current.value = datas.view[0].title;
			textarea.current.value = datas.view[0].text;
			const httpsReference = ref(storage, datas.view[0].img);
			setFilename(httpsReference.name);
			file_link_ref.current = { url: datas.view[0].img };
			setContent(() => {
				return { ...datas.view[0], img: datas.view[0].img,  text: datas.view[0].text, title: datas.view[0].title};
			});
		} else if (type === "edit" && datas.view.length <= 0) {
			dispatch(loadthisMagazineFB(doc_id, false));
		}
	}, [datas]);

	const uploadImage = async (e) => {
		if (e.target.files[0]) {
			noImage.current = true;
			const uploaded_file = await uploadBytes(
				ref(storage, `images/${e.target.files[0].name}`),
				e.target.files[0]
			);
			setFilename(e.target.files[0].name);
			const file_url = await getDownloadURL(uploaded_file.ref);
			
			setContent((prev) => {
				return { ...prev, img: file_link_ref.current.url };
			});
			file_link_ref.current = (type === 'edit') ? { url: datas.view[0].img } : { url: file_url };
			setImgFile(e.target.files.length);
		} else {
			noImage.current = false;
		}
	};

	const inputs = [title.current, file.current, textarea.current]; // 빈칸 체크할 ref들 배열
	const [validation, setValidation] = useState([true, true, true]); // ref들 빈칸 여부 체크할 state

	const buttonClicked = useRef(false);
	const registerMagazine = async () => {
		// 등록하기 클릭했을 경우 발생하는 이벤트
		buttonClicked.current = true;
		await inputs.reduce((acc, cur, idx) => {
			if (cur?.value.trim() === "") {
				// 빈칸이거나 공백만 있을 경우
				setValidation((props) => {
					const _props = [...props];
					_props[idx] = false;
					return [..._props];
				});
			} else {
				setValidation((props) => {
					const _props = [...props];
					_props[idx] = true;
					return [..._props];
				});
			}
		}, 0);
	};

	useEffect(() => {
		// validation 값 바뀔때마다 업데이트(등록하기 버튼 누를 때)
		if (buttonClicked.current) {
			checkEmpty();
			buttonClicked.current = false;
		}
	}, [validation]);
	const checkEmpty = () => {
		for (let i = 0; i < validation.length; i++) {
			// false 있을 경우(빈칸) focus
			if (validation[i] === false) {
				inputs[i].focus();
				break;
			}
			if (i + 1 === validation.length) {
				// 빈칸 없을 경우
				console.log("dispatch");
				(type === 'write' ? dispatch(createMagazineFB(content)) : dispatch(updateMagazineFB(doc_id, content)))
			}
		}
	};

	return (
		<div className="contents">
			<InputArea>
				<SectionTitle>
					Place <span>소개할 장소 이름을 적어주세요 :)</span>
				</SectionTitle>
				<div className="input_box">
					<div>
						<input
							type="text"
							ref={title}
							onInput={() => {
								setContent((prev) => {
									return { ...prev, title: title.current.value };
								});
							}}
						/>
						{!validation[0] && (
							<p className="txt_error">장소 이름은 필수 항목입니다.</p>
						)}
					</div>
				</div>
			</InputArea>
			<InputArea className="file">
				<SectionTitle className="label">
					Photo <span>장소 이미지를 공유해주세요</span>
				</SectionTitle>
				<div className="input_box">
					<label>
						<input
							type="file"
							ref={file}
							onChange={uploadImage}
							// disabled={type === "edit" && true}
						/>
						<Attachment>
							<p>{filename}</p>
							<Button st="primary">이미지 업로드</Button>
						</Attachment>
					</label>
					{!validation[1] && (
						<p className="txt_error">이미지는 필수 항목입니다.</p>
					)}
					{!noImage.current && (
						<p className="txt_error">
							이미지 업로드가 취소되었습니다. 파일을 다시 첨부해주세요.
						</p>
					)}
				</div>
			</InputArea>
			<InputArea className="textarea">
				<SectionTitle>
					Story <span>장소에 대한 이야기를 작성해주세요</span>
				</SectionTitle>
				<div className="input_box">
					<div
						onFocus={(e) => {
							e.currentTarget.classList.add("focus");
						}}
						onBlur={(e) => {
							e.currentTarget.classList.remove("focus");
						}}
					>
						<textarea
							ref={textarea}
							onInput={() => {
								setContent((prev) => {
									return { ...prev, text: textarea.current.value };
								});
							}}
						></textarea>
					</div>
					{!validation[2] && (
						<p className="txt_error">설명은 필수 항목입니다.</p>
					)}
				</div>
			</InputArea>
			<InputArea className="layout">
				<SectionTitle>
					Layout <span>레이아웃을 선택해주세요</span>
				</SectionTitle>
				<div className="input_box">
					{layout.map((v, i) => {
						return (
							<div key={i}>
								<label>
									<input
										type="radio"
										name="layout"
										checked={layout[i]}
										onChange={() => {
											setLayout(
												layout.map((val, idx) => {
													return idx === i ? true : false;
												})
											);
											setContent((prev) => {
												return { ...prev, layout: i };
											});
										}}
									/>
									<span className="checkmark"></span>
									<img src={img_files[i]} alt={`layout ${i + 1}`} />
								</label>
							</div>
						);
					})}
				</div>
			</InputArea>
			<section>
				<PreviewArea>
					<SectionTitle>
						Preview <span>미리보기</span>
					</SectionTitle>
					<MagazineItem
						page="write"
						layout={content.layout}
						content={content}
					></MagazineItem>
				</PreviewArea>
			</section>
			<ButtonArea>
				<Button width="m" onClick={()=>navigate('/')}>취소</Button>
				<Button width="m" st="primary" onClick={registerMagazine}>
				{type === 'write' ? '등록하기' : '수정하기'}
				</Button>
			</ButtonArea>
		</div>
	);
};

const InputArea = styled.section`
	margin-bottom: 60px;
	.input_box {
		padding: 30px 10px;
	}
	&.layout {
		.input_box {
			display: flex;
			gap: 40px;
			align-items: center;
			& > div {
				position: relative;
				label {
					position: relative;
					display: inline-block;
					height: 100%;
					padding: 11px 14px;
					cursor: pointer;
					.checkmark {
						position: absolute;
						left: 0;
						right: 0;
						top: 0;
						bottom: 0;
						border: 1px solid #ddd;
					}
					img {
						vertical-align: middle;
					}
					input {
						&:checked {
							& + .checkmark {
								border-color: #333;
							}
						}
					}
				}
			}
		}
	}
	&.textarea {
		.input_box {
			div {
				padding: 12px 0;
				border: 1px solid #333;
				textarea {
					border: none;
					padding: 0 12px;
				}
				&.focus {
					background-color: rgba(240, 240, 240, 0.5);
				}
			}
		}
	}
	input[type="file"]:disabled {
		+ div {
			cursor: default;
			& > p {
				background-color: #f0f0f0;
			}
		}
	}
`;
const SectionTitle = styled.p`
	font-size: 3rem;
	font-weight: 700;
	line-height: 1.2;
	padding-bottom: 14px;
	border-bottom: 3px solid #333;
	span {
		font-size: 1.4rem;
		font-weight: 500;
		vertical-align: middle;
		margin-left: 15px;
	}
`;
const Attachment = styled.div`
	display: flex;
	cursor: pointer;
	p {
		flex-grow: 1;
		border: 1px solid #333;
		border-right: none;
		line-height: 42px;
		padding: 0 12px;
		color: #888;
		font-size: 1.5rem;
	}
	button {
		pointer-events: none;
	}
`;
const RadioBox = styled.div``;
const PreviewArea = styled.div`
	& > div {
		padding: 30px 10px;
		max-width: 70%;
		margin: 40px auto;
		border: 1px solid #eee;
		background-color: #fff;
		box-shadow: 0 0 15px rgba(217, 217, 217, 0.5);
		.text_area {
			padding: 0 10px;
			h2 {
				font-size: 2rem;
				margin-bottom: 12px;
				strong {
					border-bottom-width: 2px;
					padding-bottom: 2px;
					&::before {
						bottom: -7px;
						left: -5px;
						right: -5px;
					}
				}
			}
			.content {
				font-size: 1.3rem;
			}
			.info_area {
				font-size: 1.1rem;
				margin-top: 7px;
				&.view {
					margin-bottom: 10px;
					dl > div {
						font-size: 1.1rem;
						line-height: 1.4rem;
					}
				}
			}
			.readmore {
				font-size: 0.9rem;
				margin-top: 14px;
				i {
					width: 30px;
					margin-right: 15px;
				}
			}
		}
		.img_area {
			padding: 0 10px;
		}
	}
	&:hover i {
		width: 45px;
	}
`;
const ButtonArea = styled.div`
	padding: 40px 0 0;
	margin-top: 120px;
	text-align: center;
	border-top: 3px solid #333;
`;

export default Write;
