import type { Entity } from "backlog-js";

export function createProjectFixture(
  overrides: Partial<Entity.Project.Project> = {},
): Entity.Project.Project {
  return {
    id: 1,
    projectKey: "TEST",
    name: "テストプロジェクト",
    chartEnabled: false,
    useResolvedForChart: false,
    subtaskingEnabled: false,
    projectLeaderCanEditProjectLeader: false,
    useWiki: true,
    useFileSharing: true,
    useWikiTreeView: false,
    useOriginalImageSizeAtWiki: false,
    useSubversion: false,
    useGit: true,
    textFormattingRule: "markdown",
    archived: false,
    displayOrder: 0,
    useDevAttributes: false,
    ...overrides,
  };
}

export function createUser(overrides: Partial<Entity.User.User> = {}): Entity.User.User {
  return {
    id: 1,
    userId: "user1",
    name: "テストユーザー",
    roleType: 1,
    lang: "ja",
    mailAddress: "test@example.com",
    lastLoginTime: "",
    ...overrides,
  };
}

export function createCommentFixture(
  overrides: Partial<Entity.Issue.Comment> = {},
): Entity.Issue.Comment {
  return {
    id: 1,
    content: "テストコメント",
    changeLog: [],
    createdUser: createUser(),
    created: "2024-01-01T00:00:00Z",
    updated: "2024-01-01T00:00:00Z",
    stars: [],
    notifications: [],
    ...overrides,
  };
}

export function createIssueFixture(
  overrides: Partial<Entity.Issue.Issue> = {},
): Entity.Issue.Issue {
  return {
    id: 1,
    projectId: 1,
    issueKey: "TEST-1",
    keyId: 1,
    issueType: { id: 1, projectId: 1, name: "タスク", color: "#7ea800", displayOrder: 0 },
    summary: "テスト課題",
    description: "テスト課題の説明",
    priority: { id: 3, name: "中" },
    status: { id: 1, projectId: 1, name: "未対応", color: "#ea2c00", displayOrder: 0 },
    assignee: createUser(),
    category: [],
    versions: [],
    milestone: [],
    createdUser: createUser(),
    created: "2024-01-01T00:00:00Z",
    updatedUser: createUser(),
    updated: "2024-01-01T00:00:00Z",
    customFields: [],
    attachments: [],
    sharedFiles: [],
    stars: [],
    ...overrides,
  };
}
