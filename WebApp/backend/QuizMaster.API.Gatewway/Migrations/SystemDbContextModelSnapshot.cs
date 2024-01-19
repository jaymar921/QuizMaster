﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using QuizMaster.API.Gateway.SystemData.Contexts;

#nullable disable

namespace QuizMaster.API.Gateway.Migrations
{
    [DbContext(typeof(SystemDbContext))]
    partial class SystemDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "7.0.15");

            modelBuilder.Entity("QuizMaster.API.Gateway.Models.System.ContactReaching", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Emai")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Firstname")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Lastname")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int?>("UserId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.ToTable("SystemReachingContacts");
                });

            modelBuilder.Entity("QuizMaster.API.Gateway.Models.System.Reviews", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Comment")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("StarRating")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.ToTable("SystemReviews");
                });

            modelBuilder.Entity("QuizMaster.API.Gateway.Models.System.SystemAbout", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Ios_link")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Mobile_link")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Version")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Web_link")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("SystemAboutData");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Description = "Lorem ipsum dolor sit amet consectetur. Pulvinar porta egestas molestie purus faucibus neque malesuada lectus. Lacus auctor sit felis sed ultrices nullam sapien ornare justo. Proin adipiscing viverra vestibulum arcu sit. Suscipit bibendum ullamcorper ut et dolor quisque nulla et.",
                            Ios_link = "",
                            Mobile_link = "",
                            Version = "1.0.0",
                            Web_link = ""
                        });
                });

            modelBuilder.Entity("QuizMaster.API.Gateway.Models.System.SystemContact", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Contact")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("SystemContactData");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Contact = "09205195701",
                            Email = "admin.quizmaster@gmail.com"
                        });
                });
#pragma warning restore 612, 618
        }
    }
}
