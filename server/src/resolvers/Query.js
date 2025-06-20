async function feed(parent, args, context, info) {
  // Optional filter logic
  const where = args.filter
    ? {
        OR: [
          { description: { contains: args.filter, mode: "insensitive" } },
          { url: { contains: args.filter, mode: "insensitive" } },
        ],
      }
    : {};

  // Optional log for debugging (can remove in prod)
  console.log("💡 Feed Resolver Args:", args);

  // Defensive fallback for skip/take
  const skip = args.skip ?? 0;
  const take = args.take ?? 10;
  const orderBy = args.orderBy ?? { createdAt: "desc" };

  // Fetch paginated + sorted links
  const links = await context.prisma.link.findMany({
    where,
    skip,
    take,
    orderBy,
  });

  // Fetch total count with same filtering
  const count = await context.prisma.link.count({ where });
  const id = generateFeedId({ skip, take, filter: args.filter || "", orderBy });

  return {
    id, // required to support caching of root-level results
    links,
    count,
  };
}

function generateFeedId({
  skip = 0,
  take = 10,
  filter = "",
  orderBy = { createdAt: "desc" },
}) {
  const orderKey = Object.entries(orderBy)
    .map(([field, dir]) => `${field}_${dir}`)
    .join("_");
  return `feed-${skip}-${take}-${filter}-${orderKey}`;
}

module.exports = {
  feed,
};
