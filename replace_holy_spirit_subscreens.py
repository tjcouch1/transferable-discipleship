import json

# Read the screens.json file
with open('assets/data/screens.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def create_new_subscreens():
    """Create the complete new subscreens array"""
    return [
        {
            "id": "OpeningReflection",
            "title": "Holy Spirit",
            "type": "ContentListScreen",
            "contents": [
                {"type": "Header", "headerText": "Opening Reflection"},
                {
                    "type": "ToggleButton",
                    "design": "answer",
                    "text": "Question: How have you experienced teaching or conversation around the Holy Spirit in the past?",
                    "altButtons": [{"design": "answer", "text": "Question: How have you experienced teaching or conversation around the Holy Spirit in the past?"}]
                },
                {
                    "type": "Slide",
                    "canClose": False,
                    "contentDesign": "tight",
                    "contents": [
                        "Many Christians tend to approach the Holy Spirit from one of two extremes.",
                        "On one side are those who strongly emphasize the gifts of the Spirit, such as tongues or miracles. At times, this emphasis can unintentionally alienate others or make people feel pressured or uncomfortable. A former pastor of mine used to say, \"The Holy Spirit exists to make you holy, not to make you weird.\"",
                        "On the other side are those who, often because of past experiences or perceived baggage, largely avoid the topic of the Holy Spirit altogether. This approach can become highly intellectual, where faith is discussed but the Spirit's active role in daily life is minimized.",
                        "Cru has historically sought a healthier middle ground. The Spirit is neither ignored nor sensationalized. Instead, the focus is placed on learning how to depend on the Holy Spirit in everyday life. Bill Bright, Cru's founder, was known for saying that the most important thing he could teach a Christian was how to walk in the power of the Spirit."
                    ]
                },
                {
                    "type": "ToggleButton",
                    "design": "answer",
                    "text": "Question: Which of these two tendencies do you resonate with more, and why?",
                    "altButtons": [{"design": "answer", "text": "Question: Which of these two tendencies do you resonate with more, and why?"}]
                },
                {
                    "type": "Slide",
                    "canClose": False,
                    "contentDesign": "tight",
                    "contents": ["Our goal here is to understand the Holy Spirit biblically and practically, without drifting toward either extreme."]
                }
            ]
        },
        {
            "id": "WhoIsHolySpirit",
            "title": "Holy Spirit",
            "type": "ContentListScreen",
            "contents": [
                {"type": "Header", "headerText": "Who Is the Holy Spirit?"},
                {
                    "type": "Slide",
                    "canClose": False,
                    "contentDesign": "tight",
                    "contents": ["The Holy Spirit is not an impersonal force or influence. The Spirit is fully God and has been active from the very beginning."]
                },
                {
                    "type": "ScriptureSlide",
                    "headerText": "Genesis 1:1–2",
                    "scripture": {
                        "reference": "Genesis 1:1-2",
                        "hiddenButton": {"text": "What was the Spirit's involvement at creation? (tap to reveal)"},
                        "revealedButton": {"text": "The Spirit of God was present and active in creation."}
                    }
                },
                {
                    "type": "ScriptureSlide",
                    "headerText": "2 Corinthians 3:17",
                    "scripture": {
                        "reference": "2 Corinthians 3:17",
                        "hiddenButton": {"text": "What is the nature of the Spirit? (Tap to reveal)"},
                        "revealedButton": {"text": "\"Now the Lord is the Spirit, and where the Spirit of the Lord is present, there is freedom.\""}
                    }
                },
                {
                    "type": "ScriptureSlide",
                    "headerText": "Matthew 3:16–17",
                    "scripture": {
                        "reference": "Matthew 3:16-17",
                        "hiddenButton": {"text": "What stands out here about Father, Son, and Spirit? (Tap to reveal)"},
                        "revealedButton": {"text": "At Jesus' baptism, the Father speaks, the Son is baptized, and the Spirit descends, revealing the triune nature of God."}
                    }
                },
                {
                    "type": "ToggleButton",
                    "design": "answer",
                    "text": "Question: Why does it matter that the Holy Spirit is fully God and not merely a force or feeling?",
                    "altButtons": [{"design": "answer", "text": "Question: Why does it matter that the Holy Spirit is fully God and not merely a force or feeling?"}]
                }
            ]
        },
        {
            "id": "WhatDoesHolySpiritDo",
            "title": "Holy Spirit",
            "type": "ContentListScreen",
            "contents": [
                {"type": "Header", "headerText": "What Does the Holy Spirit Do?"},
                {
                    "type": "Slide",
                    "canClose": False,
                    "contentDesign": "tight",
                    "contents": ["The Holy Spirit plays an essential role in both salvation and ongoing growth."]
                },
                {
                    "type": "ScriptureSlide",
                    "headerText": "Acts 2:38",
                    "scripture": {
                        "reference": "Acts 2:38",
                        "hiddenButton": {"text": "When does someone receive the Holy Spirit? (tap to reveal)"},
                        "revealedButton": {"text": "The Spirit is received when someone places faith in Jesus."}
                    }
                },
                {
                    "type": "ScriptureSlide",
                    "headerText": "Romans 5:5",
                    "scripture": {
                        "reference": "Romans 5:5",
                        "hiddenButton": {"text": "What does the Holy Spirit do? (tap to reveal)"},
                        "revealedButton": {"text": "God's love is poured out in our hearts through the Holy Spirit."}
                    }
                },
                {
                    "type": "ScriptureSlide",
                    "headerText": "Ephesians 3:16",
                    "scripture": {
                        "reference": "Ephesians 3:16",
                        "hiddenButton": {"text": "What does the Holy Spirit do? (tap to reveal)"},
                        "revealedButton": {"text": "The Spirit strengthens us in our inner being."}
                    }
                },
                {
                    "type": "ScriptureSlide",
                    "headerText": "John 14:25–26",
                    "scripture": {
                        "reference": "John 14:25-26",
                        "hiddenButton": {"text": "What does the Holy Spirit do? (tap to reveal)"},
                        "revealedButton": {"text": "The Spirit teaches and reminds us of Jesus' words."}
                    }
                },
                {
                    "type": "ScriptureSlide",
                    "headerText": "1 Corinthians 2:10–12",
                    "scripture": {
                        "reference": "1 Corinthians 2:10-12",
                        "hiddenButton": {"text": "What does the Holy Spirit do? (tap to reveal)"},
                        "revealedButton": {"text": "The Spirit helps us understand what God has freely given us."}
                    }
                },
                {
                    "type": "ScriptureSlide",
                    "headerText": "John 16:8",
                    "scripture": {
                        "reference": "John 16:8",
                        "hiddenButton": {"text": "What does the Holy Spirit do? (tap to reveal)"},
                        "revealedButton": {"text": "The Spirit convicts us of sin. (tap to go back)"}
                    }
                },
                {
                    "type": "ScriptureSlide",
                    "headerText": "John 16:13–14",
                    "scripture": {
                        "reference": "John 16:13-14",
                        "hiddenButton": {"text": "What does the Holy Spirit do? (tap to reveal)"},
                        "revealedButton": {"text": "The Spirit guides believers into truth and points attention to Jesus."}
                    }
                },
                {
                    "type": "ScriptureSlide",
                    "headerText": "Acts 1:8",
                    "scripture": {
                        "reference": "Acts 1:8",
                        "hiddenButton": {"text": "What does the Holy Spirit do? (tap to reveal)"},
                        "revealedButton": {"text": "The Spirit empowers believers to be witnesses."}
                    }
                },
                {
                    "type": "ToggleButton",
                    "design": "answer",
                    "text": "Question: Which of these roles of the Holy Spirit feels most relevant to your life right now?",
                    "altButtons": [{"design": "answer", "text": "Question: Which of these roles of the Holy Spirit feels most relevant to your life right now?"}]
                }
            ]
        },
        {
            "id": "HolySpiritHalfwayRecap",
            "title": "Holy Spirit",
            "type": "ContentListScreen",
            "contents": [
                {"type": "Header", "headerText": "Half-way Recap"},
                {
                    "type": "Slide",
                    "canClose": False,
                    "contentDesign": "tight",
                    "contents": [
                        "The Holy Spirit is not distant or impersonal. He is fully God, active from creation onward, and personally involved in the lives of believers today."
                    ]
                },
                {
                    "type": "Slide",
                    "canClose": False,
                    "contentDesign": "tight",
                    "contents": [
                        "The Spirit teaches, strengthens, guides, comforts, convicts, and empowers believers to live for Jesus. Christianity was never meant to be lived through human effort alone. God gives His Spirit so believers can know Him, understand truth, and walk in dependence on Him daily."
                    ]
                },
                {
                    "type": "ToggleButton",
                    "design": "answer",
                    "text": "Which role of the Holy Spirit feels most meaningful or needed in your life right now?",
                    "altButtons": [{"design": "answer", "text": "Which role of the Holy Spirit feels most meaningful or needed in your life right now?"}]
                },
                {
                    "type": "ToggleButton",
                    "design": "answer",
                    "text": "Which aspect of the Spirit's work is easiest for you to forget in daily life?",
                    "altButtons": [{"design": "answer", "text": "Which aspect of the Spirit's work is easiest for you to forget in daily life?"}]
                }
            ]
        },
        {
            "id": "SpiritsOngoingRole",
            "title": "Holy Spirit",
            "type": "ContentListScreen",
            "contents": [
                {"type": "Header", "headerText": "What is the ongoing role of the Spirit?"},
                {
                    "type": "ScriptureSlide",
                    "headerText": "2 Peter 1:20–21",
                    "scripture": {
                        "reference": "2 Peter 1:20-21",
                        "hiddenButton": {"text": "What is the ongoing role of the Spirit? (tap to reveal)"},
                        "revealedButton": {"text": "Scripture comes from God as people were carried along by the Holy Spirit."}
                    }
                },
                {
                    "type": "ScriptureSlide",
                    "headerText": "Ephesians 1:13–14",
                    "scripture": {
                        "reference": "Ephesians 1:13-14",
                        "hiddenButton": {"text": "What is the ongoing role of the Spirit? (tap to reveal)"},
                        "revealedButton": {"text": "The Spirit seals believers as a guarantee of their inheritance."}
                    }
                },
                {
                    "type": "ScriptureSlide",
                    "headerText": "2 Timothy 1:13–14",
                    "scripture": {
                        "reference": "2 Timothy 1:13-14",
                        "hiddenButton": {"text": "What is the ongoing role of the Spirit? (tap to reveal)"},
                        "revealedButton": {"text": "The Spirit helps guard the truth entrusted to us."}
                    }
                },
                {
                    "type": "ScriptureSlide",
                    "headerText": "Ezekiel 36:26–27",
                    "scripture": {
                        "reference": "Ezekiel 36:26-27",
                        "hiddenButton": {"text": "What is the ongoing role of the Spirit? (tap to reveal)"},
                        "revealedButton": {"text": "God promises to put His Spirit within His people."}
                    }
                },
                {
                    "type": "ScriptureSlide",
                    "headerText": "1 Corinthians 3:16",
                    "scripture": {
                        "reference": "1 Corinthians 3:16",
                        "hiddenButton": {"text": "What is the ongoing role of the Spirit? (tap to reveal)"},
                        "revealedButton": {"text": "Believers are God's temple, and God's Spirit lives in them."}
                    }
                },
                {
                    "type": "ToggleButton",
                    "design": "answer",
                    "text": "Question: How does knowing the Spirit lives in you change the way you think about obedience and faithfulness?",
                    "altButtons": [{"design": "answer", "text": "Question: How does knowing the Spirit lives in you change the way you think about obedience and faithfulness?"}]
                }
            ]
        },
        {
            "id": "HowDoWeRespond",
            "title": "Holy Spirit",
            "type": "ContentListScreen",
            "contents": [
                {"type": "Header", "headerText": "How Do We Respond to the Holy Spirit?"},
                {
                    "type": "ScriptureSlide",
                    "headerText": "Galatians 5:16–25",
                    "scripture": {
                        "reference": "Galatians 5:16-25",
                        "hiddenButton": {"text": "How should we respond to the Holy Spirit? (tap to reveal)"},
                        "revealedButton": {"text": "Believers are called to walk by the Spirit rather than the flesh."}
                    }
                },
                {
                    "type": "ToggleButton",
                    "design": "answer",
                    "text": "Question: What does it take for a healthy plant to produce fruit?",
                    "altButtons": [{"design": "answer", "text": "Question: What does it take for a healthy plant to produce fruit?"}]
                },
                {
                    "type": "Slide",
                    "canClose": False,
                    "contentDesign": "tight",
                    "contents": [
                        "Fruit is the natural result of life and health. A plant does not force fruit to grow; it produces fruit because it is rooted, nourished, and alive. In the same way, the fruit of the Spirit is the result of walking in step with the Spirit.",
                        "By contrast, Scripture speaks of \"deeds of the flesh.\" Deeds begin with temptation and involve choice. Sin follows a familiar pattern:",
                        "Temptation",
                        "Mental agreement",
                        "Action",
                        "Temporary gratification",
                        "Guilt",
                        "Shame",
                        "Hiding",
                        "Self-condemnation",
                        "Confession",
                        "Repentance",
                        "Restoration",
                        "Not every step must happen. At any point, repentance can interrupt the spiral. The longer someone remains in shame and hiding, the more sin maintains its grip. Life in the Spirit invites us out of the spiral and back into freedom."
                    ]
                },
                {
                    "type": "ToggleButton",
                    "design": "answer",
                    "text": "Question: Where do you most often notice temptation gaining momentum in your life?",
                    "altButtons": [{"design": "answer", "text": "Question: Where do you most often notice temptation gaining momentum in your life?"}]
                }
            ]
        },
        {
            "id": "BeFilledWithSpirit",
            "title": "Holy Spirit",
            "type": "ContentListScreen",
            "contents": [
                {"type": "Header", "headerText": "God's Invitation: Be Filled With the Spirit"},
                {
                    "type": "ScriptureSlide",
                    "headerText": "Ephesians 5:18",
                    "scripture": {
                        "reference": "Ephesians 5:18"
                    }
                },
                {
                    "type": "ToggleButton",
                    "design": "answer",
                    "text": "Question: What do you think it means to be filled with the Spirit?",
                    "altButtons": [{"design": "answer", "text": "Question: What do you think it means to be filled with the Spirit?"}]
                },
                {
                    "type": "Slide",
                    "canClose": False,
                    "contentDesign": "tight",
                    "contents": [
                        "In this passage, \"filled\" does not mean like water poured into a cup. The image is closer to wind filling a sail. The Greek word pneuma means spirit, wind, or breath. To be filled with the Spirit is to be moved and directed by Him.",
                        "The goal is not to create spiritual power, but to position ourselves to receive it. Just as a sail must be adjusted to catch the wind, our lives must be oriented toward God's purposes with openness and surrender."
                    ]
                }
            ]
        },
        {
            "id": "SummaryLifeInSpirit",
            "title": "Holy Spirit",
            "type": "ContentListScreen",
            "contents": [
                {"type": "Header", "headerText": "Summary: Life in the Spirit"},
                {
                    "type": "ScriptureSlide",
                    "headerText": "Romans 8:1–2",
                    "scripture": {
                        "reference": "Romans 8:1-2",
                        "answerInSlide": "Life in the Spirit brings freedom."
                    }
                },
                {
                    "type": "ScriptureSlide",
                    "headerText": "Romans 8:3–4",
                    "scripture": {
                        "reference": "Romans 8:3-4",
                        "answerInSlide": "God enables believers to live according to the Spirit."
                    }
                },
                {
                    "type": "ScriptureSlide",
                    "headerText": "Romans 8:5–11",
                    "scripture": {
                        "reference": "Romans 8:5-11",
                        "answerInSlide": "The Spirit gives life."
                    }
                },
                {
                    "type": "ScriptureSlide",
                    "headerText": "Romans 8:12–13",
                    "scripture": {
                        "reference": "Romans 8:12-13",
                        "answerInSlide": "By the Spirit, believers put sin to death."
                    }
                },
                {
                    "type": "ScriptureSlide",
                    "headerText": "Romans 8:14–16",
                    "scripture": {
                        "reference": "Romans 8:14-16",
                        "answerInSlide": "The Spirit brings assurance of belonging to God's family."
                    }
                }
            ]
        },
        {
            "id": "SpiritualBreathing",
            "title": "Holy Spirit",
            "type": "ContentListScreen",
            "contents": [
                {"type": "Header", "headerText": "Spiritual Breathing"},
                {
                    "type": "Slide",
                    "canClose": False,
                    "contentDesign": "tight",
                    "contents": ["A practical exercise for daily dependence"]
                },
                {
                    "type": "Slide",
                    "headerText": "Exhale: Confession",
                    "canClose": False,
                    "contentDesign": "tight",
                    "contents": [
                        "Agree with God about sin and acknowledge the need for His forgiveness.",
                        {
                            "type": "ScrRangeDisplay",
                            "reference": "1 John 1:9",
                            "style": {"alignSelf": "flex-start", "fontStyle": "italic"}
                        },
                        "Repent, allowing God to reshape heart, mind, and direction."
                    ]
                },
                {
                    "type": "Slide",
                    "headerText": "Inhale: Dependence",
                    "canClose": False,
                    "contentDesign": "tight",
                    "contents": [
                        "Receive God's forgiveness and walk in the Spirit's power.",
                        {
                            "type": "ScrRangeDisplay",
                            "reference": "Ephesians 5:18",
                            "style": {"alignSelf": "flex-start", "fontStyle": "italic"}
                        },
                        {
                            "type": "ScrRangeDisplay",
                            "reference": "1 John 5:14-15",
                            "style": {"alignSelf": "flex-start", "fontStyle": "italic"}
                        },
                        "Thank God for His grace, forgiveness, and indwelling Spirit.",
                        "Choose to walk attentively, responding to the Spirit's leading."
                    ]
                }
            ]
        }
    ]

# Navigate: Home -> Start Here -> Basics -> Holy Spirit
for screen in data['screens']:
    if screen.get('id') == 'Home':
        for subscreen1 in screen.get('subscreens', []):
            if subscreen1.get('id') == 'Start Here':
                for subscreen2 in subscreen1.get('subscreens', []):
                    if subscreen2.get('id') == 'Basics':
                        for subscreen3 in subscreen2.get('subscreens', []):
                            if subscreen3.get('id') == 'Holy Spirit':
                                # Replace the subscreens
                                subscreen3['subscreens'] = create_new_subscreens()
                                print(f"Replaced {len(subscreen3['subscreens'])} subscreens")
                                break
                        break
                break
        break

# Write back
with open('assets/data/screens.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Replacement complete!")

