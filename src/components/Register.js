import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import {useDispatch} from 'react-redux';

import { auth, db } from "../modules/firebase";
import Button from "./Button";
import {createUserFB} from '../modules/redux/magazineItems';

const Register = ({ type }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const input_email = useRef();
	const input_nickname = useRef();
	const input_pw = useRef();
	const input_pw_check = useRef();
	const inputs = [input_email, input_nickname, input_pw, input_pw_check];
	const [validation, setValidation] = useState([true, true, true, true]);
	const [userInfoError, SetuserInfoError] = useState(null);

	const signInEvent = async () => { // 로그인 계정 validation
		const user = await signInWithEmailAndPassword(
			auth,
			input_email.current.value,
			input_pw.current.value
		).then(() => { // 성공했을 경우 메인으로
			navigate('/'); 
		}).catch((error) => { // 실패했을 경우 error코드 따라 에러 텍스트 노출
			const errorCode = error.code;
			SetuserInfoError(errorCode.toString());
		});
	};

	const signUpEvent = async () => {
		const user = await createUserWithEmailAndPassword(
			auth,
			input_email.current.value,
			input_pw.current.value
		).then((userCredential) => { // 성공했을 경우 메인으로
			const user_data = {
				email: input_email.current.value,
				nickname: input_nickname.current.value,
			};
			dispatch(createUserFB(user_data));
		}).catch((error) => { // 실패했을 경우 error코드 따라 에러 텍스트 노출
			const errorCode = error.code;
			SetuserInfoError(errorCode.toString());
		});
	};

	const checkForm = async () => {
		const empty = inputs.reduce((acc, cur, idx) => {
			// 빈칸 확인
			if (cur.current && cur.current.value.trim().length === 0) {
				acc++;
				setValidation((props) => {
					const _props = [...props];
					_props[idx] = false;
					return [..._props];
				});
			} else if (cur.current && cur.current.value.trim().length > 0) {
				setValidation((props) => {
					const _props = [...props];
					_props[idx] = true;
					return [..._props];
				});
			}
			return acc;
		}, 0);

		if (empty <= 0) {
			// 빈칸 없을 경우
			if (type === "signin") {
				// 로그인 이벤트
				signInEvent();
			} else {
				// 회원가입 이벤트
				if (input_pw.current.value !== input_pw_check.current.value) { // 비밀번호 확인 일치하지 않을 경우
					setValidation(prev=>{
						const _validation = [...validation];
						_validation[3] = false;
						return [..._validation];
					}) 
					return false;
				}
				signUpEvent();
			}
		}
	};

	return (
		<div className="contents">
			<section>
				<Form
					onSubmit={(e) => {
						e.preventDefault();
					}}
					className={type}
				>
					<InputArea>
						{type === "signup" ? (
							<SectionTitle>
								Email <span>이메일 주소를 입력해주세요</span>
							</SectionTitle>
						) : (
							<SectionTitle>
								Email &amp; Password <span>로그인 정보를 입력해주세요</span>
							</SectionTitle>
						)}

						<div className="input_box">
							<input
								type="email"
								placeholder="이메일 주소"
								ref={input_email}
							/>
							{!validation[0] && (
								<p className="txt_error">이메일 주소를 입력해주세요!</p>
							)}
							{
								(type === 'signup' && input_email.current?.value.trim().length > 0 && userInfoError === 'auth/invalid-email') ? <p className="txt_error">이메일주소 형식이 올바르지 않습니다.</p> : null
							}
						</div>
					</InputArea>
					{type === "signup" && (
						<InputArea>
							<SectionTitle>
								Nickname <span>별명을 입력해주세요</span>
							</SectionTitle>
							<div className="input_box">
								<input
									type="text"
									ref={input_nickname}
								/>
								{!validation[1] && (
									<p className="txt_error">별명을 입력해주세요!</p>
								)}
							</div>
						</InputArea>
					)}
					<InputArea>
						{type === "signup" && (
							<SectionTitle>
								Password <span>비밀번호를 입력해주세요</span>
							</SectionTitle>
						)}

						<div className="input_box">
							<input
								type="password"
								placeholder="최소 6글자 이상"
								minLength="6"
								ref={input_pw}
							/>
							{(!validation[2] && input_pw.current.value.trim().length <= 0) && (
								<p className="txt_error">비밀번호를 입력해주세요!</p>
							)}
							{
								(type === 'signup' && userInfoError === 'auth/weak-password' && input_pw.current.value.trim().length > 0) && <p className="txt_error">비밀번호는 최소 6자 이상이어야 합니다.</p>
							}
							{type === "signup" && (
								<input
									type="password"
									placeholder="비밀번호 확인"
									minLength="6"
									ref={input_pw_check}
								/>
							)}
							{!validation[3] && (
								<p className="txt_error">비밀번호가 일치하지 않습니다!</p>
							)}
							{ // 로그인일 경우 에러텍스트
								type === 'signin' && (userInfoError === 'auth/user-not-found' ? <p className="txt_error">존재하지 않는 이메일 주소입니다.</p> : userInfoError === 'auth/invalid-email' ? <p className="txt_error">이메일주소 형식이 올바르지 않습니다.</p> : userInfoError === 'auth/wrong-password' ? <p className="txt_error">비밀번호가 일치하지 않습니다.</p> : null)
							}
						</div>
					</InputArea>
					<div
						className="btn_area"
						style={{ marginTop: type === "signin" ? "30px" : "50px" }}
					>
						<Button
							type="button"
							width="m"
							onClick={() => {
								navigate("/");
							}}
						>
							취소
						</Button>
						{type === "signup" ? (
							<Button type="button" width="m" st="primary" onClick={checkForm}>
								가입하기
							</Button>
						) : (
							<Button type="button" width="m" st="primary" onClick={checkForm}>
								로그인
							</Button>
						)}
					</div>
				</Form>
			</section>
		</div>
	);
};

const Form = styled.form`
	max-width: 540px;
	margin: 0 auto;
	&.signin {
		section {
			margin-bottom: 0;
			&:first-child {
				.input_box {
					padding-top: 40px;
				}
			}
			& + section {
				.input_box {
					padding-top: 0;
					margin-top: -5px;
				}
			}
		}
	}
`;
const InputArea = styled.section`
	margin-bottom: 30px;
	.input_box {
		padding: 20px 10px;
		input + input,
		.txt_error + input {
			margin-top: 20px;
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

export default Register;
