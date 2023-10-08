
exports["create_front_matter"] = (article) => {
     
     let obj = {draft : false}
     
     obj.title = article.title ?? "Untitled"
     obj.tags = article.tags ?? []

    return wrapInFrontMatter(obj);
}

const wrapInFrontMatter = (obj) => {
    
    let meta = ["+++"]
    Object.entries(obj).forEach( ([key, val]) => {
        if(Array.isArray(val)){
            val = `[ ${val} ]`;
        }
        meta.push(`${key} : ${val}`);
    });
    meta.push("+++")
    return meta.join("\n");
    
}
