import request from '@/utils/request'

export function followList(memberId, page=1, size=15) {
    return request({
        url: "/ums/fans/followList",
        method: 'get',
        params: {
            memberId: memberId,
            pageNum: page,
            pageSize: size
        }
    })
}

export function followerList(memberId, page=1, size=15) {
    return request({
        url: "/ums/fans/followerList",
        method: 'get',
        params: {
            memberId: memberId,
            pageNum: page,
            pageSize: size
        }
    })
}

export function follow(memberId) {
    return request({
        url: "/ums/fans/follow",
        method: 'post',
        params: {
            memberId: memberId,
        }
    })
}

export function unfollow(memberId) {
    return request({
        url: "/ums/fans/unfollow",
        method: 'post',
        params: {
            memberId: memberId,
        }
    })
}

export function remove(memberId) {
    return request({
        url: "/ums/fans/remove",
        method: 'post',
        params: {
            memberId: memberId,
        }
    })
}