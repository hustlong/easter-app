import request from "@/utils/request";

export function collectList(page=1, size=10) {
    return request({
        url: '/bms/collect/list',
        method: 'get',
        params: {
            pageNum: page,
            pageSize: size
        }
    })
}

export function collectListOfBlog(blogId, page=1, size=10) {
    return request({
        url: '/bms/collect/listByBlogId',
        method: 'get',
        params: {
            blogId: blogId,
            pageNum: page,
            pageSize: size
        }
    })
}


export function collectDelete(collectId) {
    return request({
        url: '/bms/collect/delete',
        method: 'post',
        params: {
            collectId: collectId
        }
    })
}

export function collectAdd(blogId, notes) {
    return request({
        url: '/bms/collect/add',
        method: 'post',
        params: {
            blogId: blogId,
            notes: notes
        }
    })
}