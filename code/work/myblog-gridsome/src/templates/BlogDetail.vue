<template>
  <Layout>
    <div class="el-col el-col-18" style="padding-left: 10px">
      <section>
        <div style="min-height: 600px" class="">
          <div class="el-card is-never-shadow" style="min-height: 400px">
            <div class="el-card__header">
              <div>
                <div class="el-row">
                  <div class="el-col el-col-12">
                    <span
                      >{{
                        $page.post.updated_at | date("YYYY.MM.DD")
                      }}
                      更新</span
                    >
                  </div>
                  <div class="el-col el-col-12">
                    <div style="text-align: right">
                      <button
                        type="button"
                        class="el-button el-button--text"
                        style="padding: 3px 0px"
                      >
                        <i class="el-icon-share"></i><span>分享</span>
                      </button>
                      <button
                        type="button"
                        class="el-button el-button--text"
                        style="padding: 3px 0px"
                      >
                        <g-link to="/blog" style="color: #1e6bb8">
                          <i class="el-icon-more-outline"></i
                          ><span> 更多博客 </span>
                        </g-link>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="el-card__body">
              <div
                style="
                  font-size: 0.9rem;
                  line-height: 1.5;
                  color: rgb(96, 108, 113);
                "
              >
                发布 {{ $page.post.created_at | date("YYYY.MM.DD HH:mm:ss") }}
                <br />
                更新 {{ $page.post.updated_at | date("YYYY.MM.DD HH:mm:ss") }}
              </div>

              <div
                style="
                  font-size: 1.1rem;
                  line-height: 1.5;
                  color: rgb(48, 49, 51);
                  border-bottom: 1px solid rgb(228, 231, 237);
                  padding: 5px 0px;
                "
              >
                <pre style="font-family: 微软雅黑">{{ $page.post.title }}</pre>
              </div>
              <div
                class="markdown-body"
                v-html="mdToHtml($page.post.content)"
              ></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </Layout>
</template>

<page-query>
query($id:ID!){
   post: strapiPost(id:$id){
    id,
    title,
    content,
    created_at,
    updated_at,
    cover{
      url
    },
    tags{
      id,
      title,
    }
  }

  general : allStrapiGeneral{
    edges{
      node{
        id,
        title,
        subtitle,
        githubUrl,
        blogUrl,
        cover{
          url
        }
      }
    }
  }
}
</page-query>

<script>
import MarkdownIt from "markdown-it";
const md = new MarkdownIt();
export default {
  name: "BlogDetail",
  metaInfo() {
    return {
      title: this.$page.post.title,
    };
  },
  // 将markdown文件转换成html
  methods: {
    mdToHtml(markdown) {
      return md.render(markdown);
    },
  },
};
</script>

<style>
</style>