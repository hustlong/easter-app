import request from '@/utils/request'

export function publish(content, pics, files) {
    const paramBlog = {}
    paramBlog['collectStatus'] = true
    paramBlog['commentStatus'] = true
    paramBlog['publishStatus'] = true
    paramBlog['content'] = content
    let picStr = ''
    for (let i=0; i<pics.length; i++) {
        picStr += pics[i].url
        picStr += ','
    }
    let fileStr = ''
    for (let i=0; i<files.length; i++) {
        fileStr += files[i].url
        fileStr += ','
    }
    paramBlog['pics'] = picStr
    paramBlog['files'] = fileStr

    console.log("axios => ", paramBlog)

    return request({
        url: '/bms/blog/add',
        method: 'post',
        data: paramBlog
    })
}

export function blogList(memberId, pageNum=1, pageSize=15) {
    return request({
        url: '/bms/blog/list',
        method: 'get',
        params: {
            memberId: memberId,
            pageNum: pageNum,
            pageSize: pageSize
        }
    })
}

export function timeline(pageNum=1, pageSize=15) {
    return request({
        url: '/ums/timeline/list',
        method: 'get',
        params: {
            pageNum: pageNum,
            pageSize: pageSize
        }
    })
}

export function blogDelete(blogId) {
    return request({
        url: '/bms/blog/delete',
        method: 'post',
        params: {
            blogId: blogId
        }
    })
}
