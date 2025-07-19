import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, integer ,serial, uuid} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
	updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
	role: text('role'),
	banned: boolean('banned'),
	banReason: text('ban_reason'),
	banExpires: timestamp('ban_expires')
});

export const session = pgTable("session", {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	impersonatedBy: text('impersonated_by')
});

export const account = pgTable("account", {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at').$defaultFn(() => new Date())
});

//asset management tables


export const category = pgTable("category", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), 
  description: text("description"),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull()
});

export const  asset = pgTable('asset',{
	id : uuid("id").defaultRandom().primaryKey(),
	title : text('title').notNull(),
	description:text('description'),
	image:text('image').notNull(),
	location:text('location'),
	isApproved:text('is_approved').default('pending').notNull(),
	userId : text('user_id').notNull().references(()=>user.id ,{onDelete:'cascade'}),
	categoryId:integer('category_id').references(()=>category.id),
	createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
	updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
	isAvailable: boolean("is_available").$defaultFn(() => true),
	availableFrom: timestamp("available_from"),
	availableTo: timestamp("available_to"),
	pricePerDay: integer("price_per_day").notNull(),
})

export const payment = pgTable('payment', {
	id : uuid('id').defaultRandom().primaryKey(),
	amount : integer('amount').notNull(),
	currency : text('currency').default('USD').notNull(),
	status : text('status').notNull(),
	provider : text('provider').notNull(),
	providerId : text('provider_Id'),
	userId : text('user_id').notNull().references(()=>user.id),
	createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull()
})

export const purchase=pgTable('purchase', {
	id : uuid('id').defaultRandom().primaryKey(),
	assetId : uuid('asset_id').notNull().references(()=>asset.id, {onDelete : 'restrict'}),
	userId : text('user_id').notNull().references(()=>user.id, {onDelete : 'cascade'}),
	paymentId : uuid('payment_id').notNull().references(()=>payment.id),
	price : integer('price').notNull(),
	createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull()
})

export const invoice = pgTable('invoice',{
	id :uuid('id').defaultRandom().primaryKey(),
	invoiceNumber : text('invoice_numeber').notNull().unique(),
	purchaseId : uuid('purchase_id').notNull().references(()=>purchase.id,{onDelete : 'cascade'}),
	userId : text('user_id').notNull().references(()=>user.id, {onDelete : 'cascade'}),
	amount : integer('amount').notNull(),
	currency : text('currency').default('USD').notNull(),
	status : text('status').notNull(),
	htmlContent : text('html_content'),
	createdAt: timestamp('created_at').$defaultFn(() => new Date()),
	updatedAt: timestamp('updated_at').$defaultFn(() => new Date())

})

export const userReleations=relations(user,({many})=>({
	sessions : many(session),
	accounts :many(account),
	assets : many(asset),
	payments : many(payment),
	purchases : many(purchase)
}))

export const sesssionReleations=relations(session,({one})=>({
	user : one(user,{
		fields:[session.userId],
		references:[user.id]
	})
	
}))

export const accountReleations=relations(account,({one})=>({
	user : one(user,{
		fields:[account.userId],
		references:[user.id]
	})
	
}))

export const categoryReleations=relations(category,({many})=>({
	assets:many(asset)
}))

export const assetReleations=relations(asset,({one,many})=>({
	user : one(user,{
		fields : [asset.userId],
		references : [user.id]
	}),
	category:one(category,{
		fields:[asset.categoryId],
		references:[category.id]
	}),
	purchases : many(purchase)
}))

export const paymentReleations = relations(payment, ({one,many})=>({
	user : one(user,{
		fields : [payment.userId],
		references : [user.id]
	}),
	purchases : many(purchase)
}))

export const purchaseReleations = relations(purchase, ({one})=>({
	asset : one(asset,{
		fields : [purchase.assetId],
		references : [asset.id]
	}),
	user : one(user,{
		fields : [purchase.userId],
		references : [user.id]
	}),
	payment : one(payment,{
		fields : [purchase.paymentId],
		references : [payment.id]
	})
}))

export const invoiceReleations = relations(invoice, ({one})=>({
	purchase : one(purchase,{
		fields : [invoice.purchaseId],
		references : [purchase.id]
	}),
	user : one(user,{
		fields : [invoice.userId],
		references : [user.id]
	})
}))

