import { Query } from "appwrite";
import { appwriteConfig, databases } from "../config";
import { ISearchResults } from "@/types";

type TabType = "all" | "posts" | "games" | "users";

export async function searchContent(
  query: string,
  pageParam: number = 0,
  activeTab: TabType = "all",
): Promise<ISearchResults> {
  try {
    const limit = 10;
    const offset = pageParam * limit;

    // If query is empty, return initial results (most recent items)
    if (!query.trim()) {
      console.log("Fetching initial results...");

      // Only fetch data for the active tab
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
              ],
            );
            return {
              posts: [],
              games: [],
              users: usersResponse.documents,
            };
          default:
            // For "all" tab, fetch everything
            [postsResponse, gamesResponse, usersResponse] = await Promise.all([
              databases.listDocuments(
                appwriteConfig.databaseID,
                appwriteConfig.postsID,
                [
                  Query.orderDesc("$createdAt"),
                  Query.limit(limit),
                  Query.offset(offset),
                ],
              ),
              databases.listDocuments(
                appwriteConfig.databaseID,
                appwriteConfig.gamesID,
                [
                  Query.orderDesc("$createdAt"),
                  Query.limit(limit),
                  Query.offset(offset),
                ],
              ),
              databases.listDocuments(
                appwriteConfig.databaseID,
                appwriteConfig.usersID,
                [
                  Query.orderDesc("$createdAt"),
                  Query.limit(limit),
                  Query.offset(offset),
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
      console.log("Initial results:", {
        posts: results.posts.length,
        games: results.games.length,
        users: results.users.length,
      });

      return results;
    }

    console.log("Searching with query:", query);

    // Search based on active tab
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
    console.log("Search results:", {
      posts: results.posts.length,
      games: results.games.length,
      users: results.users.length,
    });

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
