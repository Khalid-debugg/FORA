import { Query } from "appwrite";
import { appwriteConfig, databases } from "../config";
import { ISearchResults } from "@/types";

type TabType = "all" | "posts" | "games" | "users";

export async function searchContent(
  query: string,
  pageParam: number = 0,
  activeTab: TabType = "all",
  userId: string,
): Promise<ISearchResults> {
  try {
    const limit = 10;
    const offset = pageParam * limit;
    console.log(userId);

    if (!query.trim()) {
      const fetchData = async () => {
        let postsResponse, gamesResponse, usersResponse;

        switch (activeTab) {
          case "posts":
            postsResponse = await databases.listDocuments(
              appwriteConfig.databaseID,
              appwriteConfig.postsID,
              [
                Query.orderDesc("$createdAt"),
                Query.limit(limit),
                Query.offset(offset),
                Query.notEqual("creator", userId),
              ],
            );
            return {
              posts: postsResponse.documents,
              games: [],
              users: [],
            };
          case "games":
            gamesResponse = await databases.listDocuments(
              appwriteConfig.databaseID,
              appwriteConfig.gamesID,
              [
                Query.orderDesc("$createdAt"),
                Query.limit(limit),
                Query.offset(offset),
                Query.notEqual("creator", userId),
              ],
            );
            return {
              posts: [],
              games: gamesResponse.documents,
              users: [],
            };
          case "users":
            usersResponse = await databases.listDocuments(
              appwriteConfig.databaseID,
              appwriteConfig.usersID,
              [
                Query.orderDesc("$createdAt"),
                Query.limit(limit),
                Query.offset(offset),
                Query.notEqual("$id", userId),
              ],
            );
            return {
              posts: [],
              games: [],
              users: usersResponse.documents,
            };
          default:
            [postsResponse, gamesResponse, usersResponse] = await Promise.all([
              databases.listDocuments(
                appwriteConfig.databaseID,
                appwriteConfig.postsID,
                [
                  Query.orderDesc("$createdAt"),
                  Query.limit(limit),
                  Query.offset(offset),
                  Query.notEqual("creator", userId),
                ],
              ),
              databases.listDocuments(
                appwriteConfig.databaseID,
                appwriteConfig.gamesID,
                [
                  Query.orderDesc("$createdAt"),
                  Query.limit(limit),
                  Query.offset(offset),
                  Query.notEqual("creator", userId),
                ],
              ),
              databases.listDocuments(
                appwriteConfig.databaseID,
                appwriteConfig.usersID,
                [
                  Query.orderDesc("$createdAt"),
                  Query.limit(limit),
                  Query.offset(offset),
                  Query.notEqual("$id", userId),
                ],
              ),
            ]);

            return {
              posts: postsResponse.documents,
              games: gamesResponse.documents,
              users: usersResponse.documents,
            };
        }
      };

      const results = await fetchData();

      return results;
    }

    const searchData = async () => {
      let postsResponse, gamesResponse, usersResponse;

      switch (activeTab) {
        case "posts":
          postsResponse = await databases.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.postsID,
            [
              Query.contains("caption", query),
              Query.orderDesc("$createdAt"),
              Query.limit(limit),
              Query.offset(offset),
              Query.notEqual("creator", userId),
            ],
          );
          return {
            posts: postsResponse.documents,
            games: [],
            users: [],
          };
        case "games":
          gamesResponse = await databases.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.gamesID,
            [
              Query.or([
                Query.contains("caption", query),
                Query.contains("location", query),
              ]),
              Query.orderDesc("$createdAt"),
              Query.limit(limit),
              Query.offset(offset),
              Query.notEqual("creator", userId),
            ],
          );
          return {
            posts: [],
            games: gamesResponse.documents,
            users: [],
          };
        case "users":
          usersResponse = await databases.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.usersID,
            [
              Query.or([
                Query.contains("name", query),
                Query.contains("username", query),
              ]),
              Query.orderDesc("$createdAt"),
              Query.limit(limit),
              Query.offset(offset),
              Query.notEqual("$id", userId),
            ],
          );
          return {
            posts: [],
            games: [],
            users: usersResponse.documents,
          };
        default:
          // For "all" tab, search everything
          [postsResponse, gamesResponse, usersResponse] = await Promise.all([
            databases.listDocuments(
              appwriteConfig.databaseID,
              appwriteConfig.postsID,
              [
                Query.contains("caption", query),
                Query.orderDesc("$createdAt"),
                Query.limit(limit),
                Query.offset(offset),
                Query.notEqual("creator", userId),
              ],
            ),
            databases.listDocuments(
              appwriteConfig.databaseID,
              appwriteConfig.gamesID,
              [
                Query.or([
                  Query.contains("caption", query),
                  Query.contains("location", query),
                ]),
                Query.orderDesc("$createdAt"),
                Query.limit(limit),
                Query.offset(offset),
                Query.notEqual("creator", userId),
              ],
            ),
            databases.listDocuments(
              appwriteConfig.databaseID,
              appwriteConfig.usersID,
              [
                Query.or([
                  Query.contains("name", query),
                  Query.contains("username", query),
                ]),
                Query.orderDesc("$createdAt"),
                Query.limit(limit),
                Query.offset(offset),
                Query.notEqual("$id", userId),
              ],
            ),
          ]);

          return {
            posts: postsResponse.documents,
            games: gamesResponse.documents,
            users: usersResponse.documents,
          };
      }
    };

    const results = await searchData();

    return results;
  } catch (error) {
    console.error("Error searching:", error);
    return {
      posts: [],
      games: [],
      users: [],
    };
  }
}
