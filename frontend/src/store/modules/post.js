import EventService from "../../services/EventService";

export const namespaced = true;

export const state = {
    post_data: null,
}

export const mutations = {
    POST_DATA(state, postData) {
        state.post_data = postData
    }
}

export const actions = {
    new_post({ commit }, post) {
        return EventService.postNewPost(post).then((response) => {
            const data = response.data;
            console.log("after post",data);
            if (response.status >= 200 && response.status < 400) {
                commit('POST_DATA', data)
            }
        })
    },
    likePost({ commit }, payload) {
        return EventService.likePost(payload).then((response) => {
            const data = response.data;
            console.log("after like post",data);
            if (response.status >= 200 && response.status < 400) {
                commit('POST_DATA', data)
            }
        })
    },
    unlikePost({ commit }, payload) {
        return EventService.unlikePost(payload).then((response) => {
            const data = response.data;
            console.log("after unlike post",data);
            if (response.status >= 200 && response.status < 400) {
                commit('POST_DATA', data)
            }
        })
    },
    deletePost({ commit}, postid) {
        return EventService.deletePost(postid).then((response) =>{
            const data = response.data;
            console.log("after delete post",data);
        })
    },
    update_post({ commit }, post) {
        return EventService.updatePost(post).then((response) => {
            const data = response.data;
            console.log("after update post",data);
            if (response.status >= 200 && response.status < 400) {
                commit('POST_DATA', data)
            }
        })
    }
}