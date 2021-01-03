<template>
  <Layout>
    <div class="el-col el-col-18" style="padding-left: 10px">
      <section>
        <div style="min-height: 600px" class="">
          <div
            class="el-card is-never-shadow"
            style="margin-bottom: 20px; display: none"
          >
            <div class="el-card__body">
              <div class="el-input" style="width: 300px">
                <input
                  type="text"
                  autocomplete="off"
                  placeholder="请输入关键字"
                  class="el-input__inner"
                />
              </div>
              <button
                type="button"
                class="el-button el-button--default is-plain is-circle"
                style="margin-left: 10px"
              >
                <i class="el-icon-search"></i>
              </button>
              <button
                type="button"
                class="el-button el-button--warning is-plain is-circle"
                style="margin-left: 10px"
              >
                <i class="el-icon-share"></i>
              </button>
              <button
                type="button"
                class="el-button el-button--primary is-plain is-round"
                style="float: right"
              >
                <i class="el-icon-edit"></i><span>写博文</span>
              </button>
            </div>
          </div>
          <div>
            <div
              class="el-card is-hover-shadow"
              v-for="edge in $page.posts.edges"
              :key="edge.node.id"
              style="margin-bottom: 20px"
            >
              <div class="el-card__header">
                <div>
                  <div class="el-row">
                    <div class="el-col el-col-16">
                      <span
                        ><g-link
                          :to="`/blog/details/${edge.node.id}`"
                          style="text-decoration: none; cursor: pointer"
                          ><i class="el-icon-edit-outline"></i>&nbsp;&nbsp;
                          {{ edge.node.updated_at | date("YYYY.MM.DD") }}
                          更新
                        </g-link></span
                      >
                    </div>
                    <div class="el-col el-col-8">
                      <div style="text-align: right">
                        <button
                          type="button"
                          class="el-button el-button--text"
                          style="padding: 3px 0px"
                        >
                          <i class="el-icon-share"></i>
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
                  最近更新
                  {{ edge.node.updated_at | date("YYYY.MM.DD HH:mm:ss") }}
                </div>
                <div
                  style="
                    font-size: 1.1rem;
                    line-height: 1.5;
                    color: rgb(48, 49, 51);
                    padding: 10px 0px 0px;
                  "
                >
                  {{ edge.node.title }}
                </div>
              </div>
            </div>

            <Pager class="page-cls" :info="$page.posts.pageInfo" />
          </div>
        </div>
      </section>
    </div>
  </Layout>
</template>

<page-query>
query($page: Int) {
  posts: allStrapiPost(perPage: 5, page: $page,order:ASC) @paginate {
    pageInfo {
      totalPages
      currentPage
    }
    edges{
      node{
        id,
    		title,
        content,
        tags{
          id,
          title
        },
        created_at,
        updated_at
      }
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
import { Pager } from "gridsome";
export default {
  name: "BlogPage",
  components: {
    Pager,
  },
  mounted() {
    console.log(this.$page.posts);
  },
};
</script>

<style>
.page-cls {
  display: flex;
  justify-content: center;
}
.page-cls a {
  min-width: 30px;
  height: 28px;
  line-height: 28px;
  margin: 0 5px;
  padding: 0 4px;
  background-color: #f4f4f5;
  color: #606266;
  border-radius: 2px;
  font-size: 14px;
  box-sizing: border-box;
  text-align: center;
}
.page-cls a:hover {
  color: #409eff;
}
.page-cls a.active {
  color: #fff;
  background-color: #409eff;
}
</style>