//magazineItems.js
import { db } from "../firebase";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	addDoc,
	updateDoc,
	deleteDoc,
} from "firebase/firestore";

// action
const LOAD = "magazine/LOAD";
const LOAD_ONE = "magazine/LOAD_ONE";
const CREATE = "magazine/CREATE";
const UPDATE = "magazine/UPDATE";
const DELETE = "magazine/DELETE";
const UPDATE_LIKE = "magazine/UPDATE_LIKE";
const GET_USER = "user/GET_USER";
const CREATE_USER = "user/CREATE_USER";

// initial state
const initialState = {
	users: [],
	user: [],
	list: [],
  view: [],
};

// action creator
export const loadMagazine = (data) => {
	return { type: LOAD, data };
};
export const loadthisMagazine = (data) => {
  return {type: LOAD_ONE, data}
}
export const createUser = (user) => {
	return { type: CREATE_USER, user };
};
export const getUser = (all_info) => {
	return { type: GET_USER, all_info };
};
export const createMagazine = (magazines) => {
	return { type: CREATE, magazines };
};
export const updateLike = (magazines) => {
	return { type: UPDATE_LIKE, magazines };
};
export const updateMagazine = (data) => {
	return { type: UPDATE, data};
}
export const deleteMagazine = (data) => {
	return { type: DELETE, data};
}


// middlewares

export const getUserFB = (email) => {
	return async (dispatch, useState) => {
		const users = await getDocs(collection(db, "users"));
		let user = {};
		let all_users = [];
		users.forEach((v) => {
			all_users.push({ ...v.data(), id: v.id });
		});
    const magazines = await getDocs(collection(db,'magazine'));
    let all_magazines = [];
    magazines.forEach((v,i) => {
			all_magazines.push({ ...v.data(), id: v.id});
		});
		if (email === null) {
      all_magazines.forEach((v) => {
        v.like_on = false;
      });
      dispatch(getUser({ user: user, all_magazines: all_magazines, all_users: all_users }));
		} else {
			all_users.forEach((v) => {
				if (v.email === email) user = { ...v };
			});
      all_magazines.reduce((item_acc,item)=>{
        item.like.reduce((liked_user_acc, liked_user)=>{
          if(liked_user === user.id) item.like_on = true;
          else item.like_on = false;
        },0)
      },0)
			dispatch(getUser({ user: user, all_magazines: all_magazines, all_users: all_users }));
		}
	};
};

export const createUserFB = (new_user) => {
	return async (dispatch, useState) => {
		// 파이어스토어
		const userRef = await addDoc(collection(db, "users"), new_user);
		const _user = await getDoc(userRef);
		// 리덕스
		const user = { ...new_user, id: _user.id };
		await dispatch(createUser(user));
		window.location.href = '/'
	};
};

export const loadMagazineFB = (user_id) => {
	return async (dispatch, useState) => {
		// 게시글 가져오기
		const docs = await getDocs(collection(db, "magazine"));
		const all_datas = [];
		await docs.forEach((v) => all_datas.push({ ...v.data(), id: v.id }));
		for (let i = 0; i < all_datas.length; i++) {
			// 게시글 하트 비활성 상태로 초기화
			all_datas[i].like_on = false;
		}
		// 회원 목록 가져오기
		const users = await getDocs(collection(db, "users"));
		const all_users = [];
		await users.forEach((v) => all_users.push(v.data()));
		// 로그인한 상태일 경우
		if (user_id === null || user_id === undefined) {
			// 로그인 안돼있는 경우
			console.log("로그인 안돼있음", user_id);
			dispatch(loadMagazine({ user: {}, all_datas: all_datas }));
		} else {
			// 로그인 돼있는 경우
			// 로그인한 유저 가져오기
			console.log("로그인 돼있음", user_id);
			const user_ref = await doc(db, "users", user_id);
			const _user = await getDoc(user_ref);
			const user = { ..._user.data(), id: user_ref.id };
			// 각 게시글 좋아요 정보에 로그인한 유저 id 있을 경우 해당 게시글 좋아요 상태 active
			all_datas.map((data) => {
				data.like.length > 0 &&
					data.like.map((liked_user_id) => {
						if (liked_user_id === _user.id) {
							data.like_on = true;
							console.log(data.title, "좋아요한 게시글");
						}
					});
			});
			dispatch(loadMagazine({ user: user, all_datas: all_datas }));
		}
	};
};

export const loadthisMagazineFB = (magazine_id, unmount) => {
  return async (dispatch, useState) => {
    // 불러올 magazine
		console.log('middlewarea emfdjdhkSk')
    const docRef = await doc(collection(db, 'magazine'), magazine_id);
    const _doc = await getDoc(docRef);
    let this_doc = [];
    if(!unmount) this_doc = [{..._doc.data(), id: _doc.id}];
    const all_users = useState().magazineItems.user;
    const this_user = [...useState().magazineItems.user];
    const all_docs = [...useState().magazineItems.list];
    dispatch(loadthisMagazine({user: this_user, list: all_docs, users: all_users, view: this_doc}))

  }

}

export const createMagazineFB = (new_magazine) => {
	return async (dispatch, useState) => {
		const docRef = await addDoc(collection(db, "magazine"), {
			...new_magazine,
			like: [],
      like_on: false
		});
		const _new = await getDoc(docRef);
		const newDoc = { ...new_magazine, id: _new.id, like: [], like_on: false };
		const state = useState();
		const magazines = [...state.magazineItems.list, newDoc];
		await dispatch(createMagazine(magazines));
		window.location.href = '/'
	};
};

export const updateLikeFB = (post_id, user_id) => {
	return async (dispatch, useState) => {
		// firestore 업데이트
		const doc_ref = await doc(db, "magazine", post_id);
		const _doc = await getDoc(doc_ref);
		const new_doc = { ..._doc.data() };
		if (new_doc.like_on) {
			new_doc.like_on = false;
			const new_like = new_doc.like.filter((v) => v !== user_id);
			new_doc.like = new_like;
		} else {
			new_doc.like_on = true;
			new_doc.like.push(user_id);
		}
		await updateDoc(doc_ref, { like_on: new_doc.like_on, like: new_doc.like });

		// redux 업데이트
		const all_docs = useState().magazineItems.list;
    const new_docs_redux = [...all_docs];
		new_docs_redux.map((v) => {
			if (v.id === post_id){
        if(v.like_on){
          v.like_on = false;
          const new_like = v.like.filter(v=>v !== user_id);
          v.like = [...new_like];
        }else{
          v.like_on = true;
          v.like.push(user_id);
        }
      }
		});

		dispatch(updateLike(new_docs_redux));
	};
};

export const updateMagazineFB = (doc_id, content) => {
	return async (dispatch, useState) => {
		const docRef = await doc(collection(db, 'magazine'), doc_id);
		await updateDoc(docRef, {...content})
		const users = useState().magazineItems.users;
		const user = useState().magazineItems.user;
		const list = useState().magazineItems.list;
		const view = [];
		const new_data = {
			list: [...list],
			users: [...users],
			user: [...user],
			view: view,
		}
		await dispatch(updateMagazine(new_data));
		window.location.href = `/view/${doc_id}`;
	}
}

export const deleteMagazineFB = (doc_id) => {
	return async (dispatch, useState) => {
		const docRef = await doc(db, 'magazine', doc_id);
		await deleteDoc(docRef);
		const users = useState().magazineItems.users;
		const user = useState().magazineItems.user;
		const _list = useState().magazineItems.list;
		const list = _list.filter(v=>v.id !== doc_id);
		const view = [];
		const new_data = {
			list: [...list],
			users: [...users],
			user: [...user],
			view: view,
		}
		await dispatch(deleteMagazine(new_data));
		window.location.href = '/';
	}
}

// reducer
export default function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case "user/CREATE_USER": {
			const new_state = {
				user: [action.user],
				list: [...state.list],
				users: [...state.users, action.user],
        view: [],
			};
			return { ...new_state };
		}
		case "user/GET_USER": {
			const user = action.all_info.user;
			const all_magazines = action.all_info.all_magazines;
			const all_users = action.all_info.all_users;
			const new_state = {
				user: [user],
				list: [...all_magazines],
				users: [...all_users],
        view: [],
			};
			return { ...new_state };
		}
		case "magazine/LOAD": {
			const user = [action.data.user];
			const magazines = [...action.data.all_datas];
			const new_state = {
				user: user,
				list: magazines,
				users: [...state.users],
        view: [],
			};
			return { ...new_state };
		}
    case "magazine/LOAD_ONE": {
      const user = [...action.data.user];
      const list = [...action.data.list];
      const users = [...action.data.users];
      const view = [...action.data.view];
      const new_state = {
				user: user,
				list: list,
				users: users,
        view: view,
			};
      return { ...new_state };
    }
		case "magazine/CREATE": {
			const new_state = {
				user: [...state.user],
				list: [...action.magazines],
				users: [...state.users],
        view: [],
			};
			return { ...new_state };
		}
		case "magazine/UPDATE": {
			const new_state = action.data;
			return {...new_state};
		}
		case "magazine/DELETE": {
			const new_state = action.data;
			return {...new_state};
		}
		case "magazine/UPDATE_LIKE": {
			const new_state = {
				user: [...state.user],
				list: [...action.magazines],
				users: [...state.users],
        view: [],
			};
			return { ...new_state };
		}
		default: {
			return state;
		}
	}
}
