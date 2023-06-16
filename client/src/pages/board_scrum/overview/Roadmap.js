import React, { useEffect, useState } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

const Roadmap = ({ stories, releases, boards, dashboardId }) => {
  const [formatedReleases, setFormatedReleases] = useState([]);
  useEffect(() => {
    const formatStories = () => {
      const formattedReleasesTemp = Object.entries(releases).map(
        ([releaseId, releaseData]) => {
          const formattedRelease = {
            name: releaseId,
            sprints: [],
          };

          releaseData.forEach((sprint) => {
            const sprintData = {
              name: sprint.name,
              stories: [],
            };

            sprintData.stories = stories.filter(
              (story) => story.boardId === sprint.boardId
            );

            boards.forEach((board) => {
              if (board.id === sprint.boardId) {
                console.log(board.data.toDo);

                const filteredItems = board.data.toDo.items.filter((item) => {
                  return sprintData.stories.some(
                    (story) => story.storyId === item.storyId
                  );
                });

                const totalAdvance = filteredItems.reduce((sum, item) => {
                  const subSum = item.advancement.reduce((subSum, obj) => {
                    return subSum + obj.advance;
                  }, 0);
                  return sum + subSum;
                }, 0);

                const averageAdvance =
                  filteredItems.length > 0
                    ? (totalAdvance / (filteredItems.length * 100)) * 100
                    : 0;

                sprintData.advance = averageAdvance + "%";
              }
            });

            formattedRelease.sprints.push(sprintData);
          });

          return formattedRelease;
        }
      );
      console.log(formattedReleasesTemp);
      setFormatedReleases(formattedReleasesTemp);
    };

    formatStories();
  }, [releases, stories, boards]);

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#E4E4E4",
      padding: 10,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    title: {
      fontSize: 24,
      textAlign: "center",
      fontWeight: "bold",
      marginBottom: 10,
    },
    table: {
      display: "table",
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#000",
    },
    tableRow: {
      flexDirection: "row",
    },
    tableCol: {
      flexDirection: "column",
    },
    tableCell: {
      width: "25%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#000",
      padding: 5,
      backgroundColor: "#bfd8ff",
    },
    tableCellLarge: {
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#000",
      padding: 5,
    },
    tableHeader: {
      borderRadius: "5",
      fontWeight: "bold",
      marginBottom: 10,
    },
    releaseHeader: {
      backgroundColor: "#8ab7ff",
    },
    sprintHeader: {
      backgroundColor: "#a2c4fc",
    },
  });
  const PDF = () => {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <View style={styles.tableHeader}>
              <Text style={styles.title}>Roadmap Boards Edu-Scrum</Text>
            </View>
            {formatedReleases.length > 0 &&
              formatedReleases.map((release) => (
                <View
                  style={{
                    borderStyle: "solid",
                    borderWidth: 1,
                    borderColor: "#000",
                    marginBottom: 50,
                  }}
                >
                  <View>
                    <View style={[styles.tableCellLarge, styles.releaseHeader]}>
                      <Text>{release.name}</Text>
                    </View>
                    {release.sprints.map((sprint) => (
                      <View>
                        <View
                          style={[styles.tableCellLarge, styles.sprintHeader]}
                        >
                          <Text>{sprint.name}</Text>
                        </View>
                        <View style={styles.tableRow}>
                          <View style={[styles.tableCell, { width: "50%" }]}>
                            <Text>Nom de la story</Text>
                          </View>
                          <View style={[styles.tableCell, { width: "20%" }]}>
                            <Text>Valeur</Text>
                          </View>
                          <View style={[styles.tableCell, { width: "30%" }]}>
                            <Text>Avancement</Text>
                          </View>
                        </View>
                        {sprint.stories.map((story, index) => (
                          <View style={styles.tableRow}>
                            <View style={[styles.tableCell, { width: "50%" }]}>
                              <Text>{story.name}</Text>
                            </View>
                            <View style={[styles.tableCell, { width: "20%" }]}>
                              <Text>{story.value}</Text>
                            </View>
                            <View style={[styles.tableCell, { width: "30%" }]}>
                              <Text>{sprint.advance}</Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                </View>
              ))}
          </View>
        </Page>
      </Document>
    );
  };

  const generatePDF = async () => {
    const blob = await pdf(<PDF />).toBlob();
    return blob;
  };

  const uploadPDF = async () => {
    const pdfBlob = await generatePDF();

    const formData = new FormData();
    formData.append("pdfFile", pdfBlob, "roadmap.pdf");
    formData.append("fieldName", "roadmap");

    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_API}/agile/` + dashboardId + "/folder",
        formData
      );
      toast.success("Votre persona a été ajouté à votre dossier agile", {
        duration: 5000,
      });
    } catch (error) {
      toast.error(
        "Une erreur s'est produite. Veuillez réessayer ultérieurement.",
        {
          duration: 5000,
        }
      );
    }
  };

  return (
    <>
      <Toaster />
      {formatedReleases.length > 0 && (
        <MenuItem variant="contained" onClick={uploadPDF}>
          Ajouter la roadMap au dossier agile
        </MenuItem>
      )}
    </>
  );
};

export default Roadmap;
