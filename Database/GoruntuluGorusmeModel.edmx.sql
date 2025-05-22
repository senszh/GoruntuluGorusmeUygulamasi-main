
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 05/17/2025 20:41:49
-- Generated from EDMX file: C:\Users\Asus\Desktop\GoruntuluGorusmeUygulamasi-main\Database\GoruntuluGorusmeModel.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [GoruntuluGorusmeDb];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[FK_MESSAGE_ACCOUNT_RECEIVER]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[MESSAGE] DROP CONSTRAINT [FK_MESSAGE_ACCOUNT_RECEIVER];
GO
IF OBJECT_ID(N'[dbo].[FK_MESSAGE_ACCOUNT_SENDER]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[MESSAGE] DROP CONSTRAINT [FK_MESSAGE_ACCOUNT_SENDER];
GO

-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[ACCOUNT]', 'U') IS NOT NULL
    DROP TABLE [dbo].[ACCOUNT];
GO
IF OBJECT_ID(N'[dbo].[MESSAGE]', 'U') IS NOT NULL
    DROP TABLE [dbo].[MESSAGE];
GO
IF OBJECT_ID(N'[dbo].[sysdiagrams]', 'U') IS NOT NULL
    DROP TABLE [dbo].[sysdiagrams];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'ACCOUNT'
CREATE TABLE [dbo].[ACCOUNT] (
    [USER_ID] int IDENTITY(1,1) NOT NULL,
    [NAME_SURNAME] varchar(250)  NULL,
    [EMAIL] varchar(250)  NULL,
    [PASS] varchar(255)  NULL,
    [IMAGE] varchar(255)  NULL,
    [HUB_ID] varchar(255)  NULL
);
GO

-- Creating table 'MESSAGE'
CREATE TABLE [dbo].[MESSAGE] (
    [MESSAGE_ID] int IDENTITY(1,1) NOT NULL,
    [MESSAGE_SENDER] int  NULL,
    [MESSAGE_RECEIVER] int  NULL,
    [MESSAGE_CONTENT] varchar(255)  NULL,
    [MESSAGE_DATE] datetime  NULL
);
GO

-- Creating table 'sysdiagrams'
CREATE TABLE [dbo].[sysdiagrams] (
    [name] nvarchar(128)  NOT NULL,
    [principal_id] int  NOT NULL,
    [diagram_id] int IDENTITY(1,1) NOT NULL,
    [version] int  NULL,
    [definition] varbinary(max)  NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [USER_ID] in table 'ACCOUNT'
ALTER TABLE [dbo].[ACCOUNT]
ADD CONSTRAINT [PK_ACCOUNT]
    PRIMARY KEY CLUSTERED ([USER_ID] ASC);
GO

-- Creating primary key on [MESSAGE_ID] in table 'MESSAGE'
ALTER TABLE [dbo].[MESSAGE]
ADD CONSTRAINT [PK_MESSAGE]
    PRIMARY KEY CLUSTERED ([MESSAGE_ID] ASC);
GO

-- Creating primary key on [diagram_id] in table 'sysdiagrams'
ALTER TABLE [dbo].[sysdiagrams]
ADD CONSTRAINT [PK_sysdiagrams]
    PRIMARY KEY CLUSTERED ([diagram_id] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- Creating foreign key on [MESSAGE_RECEIVER] in table 'MESSAGE'
ALTER TABLE [dbo].[MESSAGE]
ADD CONSTRAINT [FK_MESSAGE_ACCOUNT_RECEIVER]
    FOREIGN KEY ([MESSAGE_RECEIVER])
    REFERENCES [dbo].[ACCOUNT]
        ([USER_ID])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_MESSAGE_ACCOUNT_RECEIVER'
CREATE INDEX [IX_FK_MESSAGE_ACCOUNT_RECEIVER]
ON [dbo].[MESSAGE]
    ([MESSAGE_RECEIVER]);
GO

-- Creating foreign key on [MESSAGE_SENDER] in table 'MESSAGE'
ALTER TABLE [dbo].[MESSAGE]
ADD CONSTRAINT [FK_MESSAGE_ACCOUNT_SENDER]
    FOREIGN KEY ([MESSAGE_SENDER])
    REFERENCES [dbo].[ACCOUNT]
        ([USER_ID])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_MESSAGE_ACCOUNT_SENDER'
CREATE INDEX [IX_FK_MESSAGE_ACCOUNT_SENDER]
ON [dbo].[MESSAGE]
    ([MESSAGE_SENDER]);
GO

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------