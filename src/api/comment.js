import request from '@/utils/request'

export function commentRcv(page=1, size=15) {
    return request({
        url: '/bms/comment/rcvList',
        method: 'get',
        params: {
            pageNum: page,
            pageSize: size
        }
    })
}

export function commentSent(page=1, size=15) {
    return request({
        url: '/bms/comment/sentList',
        method: 'get',
        params: {
            pageNum: page,
            pageSize: size
        }
    })
}

export function commentOfBlog(blogId, page=1, size=15) {
    return request({
        url: '/bms/comment/listByBlogId',
        method: 'get',
        params: {
            blogId: blogId,
            pageNum: page,
            pageSize: size
        }
    })
}

export function commentDelete(commentId) {
    return request({
        url: '/bms/comment/delete',
        method: 'post',
        params: {
            commentId: commentId
        }
    })
}

export function comment(blogId, content) {
    return request({
        url: '/bms/comment/add',
        method: 'post',
        params: {
            blogId: blogId,
            content: content
        }
    })
}