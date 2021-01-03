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
                    <span>{{ $page.project.name }}</span>
                  </div>
                  <div class="el-col el-col-12">
                    <div style="text-align: right">
                      <!-- <button
                        type="button"
                        class="el-button el-button--text"
                        style="padding: 3px 0px"
                      >
                        <i class="el-icon-share"></i><span>分享</span>
                      </button> -->
                      <button
                        type="button"
                        class="el-button el-button--text"
                        style="padding: 3px 0px"
                      >
                        <a :href="$page.project.githubUrl" target="_blank">
                          <i class="el-icon-back"></i><span>前往GitHub</span></a
                        >
                      </button>
                      <button
                        type="button"
                        class="el-button el-button--text"
                        style="padding: 3px 0px"
                      >
                        <g-link to="/project">
                          <i class="el-icon-more-outline"></i
                          ><span>更多项目</span></g-link
                        >
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
                发布
                {{ $page.project.created_at | date("YYYY.MM.DD HH:mm:ss") }}
                <br />
                更新
                {{ $page.project.updated_at | date("YYYY.MM.DD HH:mm:ss") }}
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
                <pre style="font-family: 微软雅黑">{{
                  $page.project.title
                }}</pre>
              </div>

              <div
                style="
                  font-size: 1.1rem;
                  color: rgb(48, 49, 51);
                  padding: 15px 0px;
                  border-bottom: 1px solid rgb(228, 231, 237);
                "
              >
                <div class="el-row">
                  <div class="el-col el-col-16" style="padding-top: 5px">
                    <i
                      class="el-icon-star-off el-tooltip"
                      aria-describedby="el-tooltip-1902"
                      tabindex="0"
                      style="margin: 0px 5px 0px 0px"
                    ></i>
                    {{ $page.project.star }}
                    <i
                      class="el-icon-view el-tooltip"
                      aria-describedby="el-tooltip-3269"
                      tabindex="0"
                      style="margin: 0px 5px 0px 15px"
                    ></i>
                    {{ $page.project.watch }}
                    <i
                      class="el-icon-bell el-tooltip"
                      aria-describedby="el-tooltip-8924"
                      tabindex="0"
                      style="margin: 0px 5px 0px 15px"
                    ></i>
                    {{ $page.project.fork }}
                  </div>
                  <div class="el-col el-col-8" style="text-align: right">
                    <span
                      v-for="(tag, index) in $page.project.tags"
                      :key="tag.id"
                      class="el-tag el-tag--small"
                      :class="[
                        index % 2 === 0 ? 'el-tag--danger' : 'el-tag--success',
                      ]"
                      style="margin-right: 5px"
                      >{{ tag.title }}
                    </span>

                    <!-- <span class="el-tag el-tag--success el-tag--small"
                        >JavaScript</span
                      > -->
                  </div>
                </div>
              </div>
              <div
                style="padding-top: 20px"
                class="markdown-body"
                v-html="mdToHtml($page.project.content)"
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
   project: strapiProject(id:$id){
    id,
    name,
    title,
    content,
    star,
    watch,
    fork,
    githubUrl,
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
  name: "ProjectDetailPage",
  metaInfo() {
    return {
      title: this.$page.project.title,
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